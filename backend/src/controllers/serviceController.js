const Service = require('../models/Service');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const APIFeatures = require('../utils/apiFeatures');

// Create a new service (Admin only)
exports.createService = catchAsync(async (req, res, next) => {
  const {
    name,
    description,
    price,
    duration, // in minutes
    category,
    image,
    includedServices,
    addOns,
    isActive = true,
    isFeatured = false,
  } = req.body;

  const service = await Service.create({
    name,
    description,
    price,
    duration,
    category,
    image,
    includedServices,
    addOns,
    isActive,
    isFeatured,
    createdBy: req.user.id,
  });

  res.status(201).json({
    status: 'success',
    data: {
      service,
    },
  });
});

// Get all services (with filtering)
exports.getAllServices = catchAsync(async (req, res, next) => {
  // Build query
  const features = new APIFeatures(
    Service.find(),
    req.query
  )
    .filter()
    .sort()
    .limitFields()
    .paginate();

  // Execute query
  const services = await features.query;
  const total = await Service.countDocuments(features.queryString);

  res.status(200).json({
    status: 'success',
    results: services.length,
    total,
    data: {
      services,
    },
  });
});

// Get a single service
exports.getService = catchAsync(async (req, res, next) => {
  const service = await Service.findById(req.params.id);

  if (!service) {
    return next(new AppError('No service found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      service,
    },
  });
});

// Update a service (Admin only)
exports.updateService = catchAsync(async (req, res, next) => {
  const service = await Service.findByIdAndUpdate(
    req.params.id,
    req.body,
    {
      new: true,
      runValidators: true,
    }
  );

  if (!service) {
    return next(new AppError('No service found with that ID', 404));
  }

  res.status(200).json({
    status: 'success',
    data: {
      service,
    },
  });
});

// Delete a service (Admin only)
exports.deleteService = catchAsync(async (req, res, next) => {
  const service = await Service.findByIdAndDelete(req.params.id);

  if (!service) {
    return next(new AppError('No service found with that ID', 404));
  }

  res.status(204).json({
    status: 'success',
    data: null,
  });
});

// Get service categories
exports.getServiceCategories = catchAsync(async (req, res, next) => {
  const categories = await Service.distinct('category');
  
  res.status(200).json({
    status: 'success',
    results: categories.length,
    data: {
      categories,
    },
  });
});

// Get featured services
exports.getFeaturedServices = catchAsync(async (req, res, next) => {
  const services = await Service.find({ isFeatured: true, isActive: true });
  
  res.status(200).json({
    status: 'success',
    results: services.length,
    data: {
      services,
    },
  });
});

// Get services by category
exports.getServicesByCategory = catchAsync(async (req, res, next) => {
  const { category } = req.params;
  
  const services = await Service.find({ 
    category: { $regex: new RegExp(category, 'i') },
    isActive: true 
  });
  
  res.status(200).json({
    status: 'success',
    results: services.length,
    data: {
      services,
    },
  });
});

// Toggle service status (Admin only)
exports.toggleServiceStatus = catchAsync(async (req, res, next) => {
  const service = await Service.findById(req.params.id);
  
  if (!service) {
    return next(new AppError('No service found with that ID', 404));
  }
  
  service.isActive = !service.isActive;
  await service.save();
  
  res.status(200).json({
    status: 'success',
    data: {
      service,
    },
  });
});

// Get popular services (most booked)
exports.getPopularServices = catchAsync(async (req, res, next) => {
  const popularServices = await Service.aggregate([
    {
      $lookup: {
        from: 'bookings',
        localField: '_id',
        foreignField: 'service',
        as: 'bookings'
      }
    },
    {
      $addFields: {
        bookingCount: { $size: '$bookings' }
      }
    },
    {
      $sort: { bookingCount: -1 }
    },
    {
      $limit: 5
    },
    {
      $project: {
        bookings: 0
      }
    }
  ]);
  
  res.status(200).json({
    status: 'success',
    results: popularServices.length,
    data: {
      services: popularServices,
    },
  });
});

// Get service statistics (Admin only)
exports.getServiceStats = catchAsync(async (req, res, next) => {
  const stats = await Service.aggregate([
    {
      $lookup: {
        from: 'bookings',
        localField: '_id',
        foreignField: 'service',
        as: 'bookings'
      }
    },
    {
      $project: {
        name: 1,
        totalBookings: { $size: '$bookings' },
        totalRevenue: {
          $reduce: {
            input: '$bookings',
            initialValue: 0,
            in: { $add: ['$$value', '$$this.totalPrice'] }
          }
        },
        avgRating: { $ifNull: [{ $avg: '$bookings.rating' }, 0] },
        category: 1
      }
    },
    {
      $sort: { totalBookings: -1 }
    }
  ]);
  
  // Get total services, categories, and revenue
  const totalServices = await Service.countDocuments();
  const totalCategories = (await Service.distinct('category')).length;
  const totalRevenue = stats.reduce((sum, service) => sum + service.totalRevenue, 0);
  
  res.status(200).json({
    status: 'success',
    data: {
      stats,
      totals: {
        services: totalServices,
        categories: totalCategories,
        revenue: totalRevenue,
      },
    },
  });
});
