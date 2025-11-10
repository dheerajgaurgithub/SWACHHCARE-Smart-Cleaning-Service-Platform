import passport from 'passport';
import { OAuth2Strategy as GoogleStrategy } from 'passport-google-oauth';
import Customer from '../models/customer.js';
import { signToken } from '../middleware/authMiddleware.js';

// Only configure Google OAuth strategy if credentials are provided
if (process.env.GOOGLE_CLIENT_ID && process.env.GOOGLE_CLIENT_SECRET) {
  passport.use(new GoogleStrategy({
      clientID: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
      callbackURL: "/api/auth/google/callback",
      passReqToCallback: true
    },
  async (req, accessToken, refreshToken, profile, done) => {
    try {
      // Check if user already exists
      let customer = await Customer.findOne({ email: profile.emails[0].value });

      if (customer) {
        // If customer exists but doesn't have Google ID, update it
        if (!customer.googleId) {
          customer.googleId = profile.id;
          await customer.save();
        }
        return done(null, customer);
      } else {
        // Create new customer
        const newCustomer = new Customer({
          googleId: profile.id,
          email: profile.emails[0].value,
          fullName: profile.displayName,
          isEmailVerified: true, // Google-verified emails are considered verified
          authMethod: 'google',
          profilePicture: profile.photos ? profile.photos[0].value : undefined
        });

        const savedCustomer = await newCustomer.save();
        return done(null, savedCustomer);
      }
    } catch (error) {
      return done(error, false);
    }
    }
  ));
} else {
  console.warn('Google OAuth credentials not found. Google login will be disabled.');
}

// Serialize user into the session
passport.serializeUser((user, done) => {
  done(null, user.id);
});

// Deserialize user from the session
passport.deserializeUser(async (id, done) => {
  try {
    const user = await Customer.findById(id);
    done(null, user);
  } catch (error) {
    done(error, null);
  }
});

export default passport;
