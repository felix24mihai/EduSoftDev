const express = require('express');
const router = express.Router();
const auth = require('../../middleware/auth');
const checkRole = require('../../middleware/checkRole');
const { check, validationResult } = require('express-validator');
const compareUsers = require('../../middleware/compareUsers');

const User = require('../../models/User');
const Profile = require('../../models/Profile');

// @route   GET /api/profiles/me
// @desc    Get current user profile
// @access  Private
router.get('/me', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({ user: req.user.id }).populate(
      'user',
      ['name', 'avatar']
    );

    if (!profile) {
      return res.status(400).json({ msg: 'There is no profile for this user' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   POST /api/profiles/:user_id
// @desc    Create or update a user profile
// @access  Private
router.post(
  '/:user_id',
  [
    auth,
    [
      check('status', 'Status is required').not().isEmpty(),
      check('skills', 'Skills are required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    //TODO better way to check if user exists
    try {
      const userExists = await User.findById(req.params.user_id);
      if (!userExists) {
        return res.status(400).send('User does not exists');
      }
    } catch {
      return res.status(400).send('User does not exists');
    }

    const checkStatus = await compareUsers(req.user.id, req.params.user_id);
    if (checkStatus == 401 || checkStatus == 500)
      return res
        .status(checkStatus)
        .send({ msg: checkStatus == 401 ? 'Unauthorized' : 'Server Error' });

    const {
      company,
      website,
      location,
      status,
      skills,
      bio,
      githubUsername,
      objective,
      linkedin,
      youtube,
      facebook,
      instagram,
      twitter,
    } = req.body;

    // Build profile objects
    const profileFields = {};
    profileFields.user = req.params.user_id;
    if (company) profileFields.company = company;
    if (website) profileFields.website = website;
    if (location) profileFields.location = location;
    if (status) profileFields.status = status;
    if (bio) profileFields.bio = bio;
    if (githubUsername) profileFields.githubUsername = githubUsername;
    if (objective) profileFields.objective = objective;
    if (skills) {
      profileFields.skills = skills.split(',').map((skill) => skill.trim());
    }

    // Build social object
    profileFields.social = {};
    if (linkedin) profileFields.social.linkedin = linkedin;
    if (youtube) profileFields.social.youtube = youtube;
    if (facebook) profileFields.social.facebook = facebook;
    if (instagram) profileFields.social.instagram = instagram;
    if (twitter) profileFields.social.twitter = twitter;

    try {
      let profile = await Profile.findOne({ user: req.params.user_id });

      if (profile) {
        // Update profile
        profile = await Profile.findOneAndUpdate(
          { user: req.params.user_id },
          { $set: profileFields },
          { new: true } // return the document after update was applied
        );

        return res.json(profile);
      }

      // Create profile
      profile = new Profile(profileFields);
      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

// @route   GET /api/profiles
// @desc    Get all profiles
// @access  Private
router.get('/', [auth, checkRole()], async (_req, res) => {
  try {
    const profiles = await Profile.find().populate('user', [
      'firstName',
      'lastName',
      'preferredName',
      'avatar',
    ]);
    res.json(profiles);
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   GET /api/profiles/user/:user_id
// @desc    Get profile by user ID
// @access  Private
router.get('/user/:user_id', auth, async (req, res) => {
  try {
    const profile = await Profile.findOne({
      user: req.params.user_id,
    }).populate('user', ['firstName', 'lastName', 'preferredName', 'avatar']);

    if (!profile) {
      return res.status(400).json({ msg: 'Profile not found' });
    }

    res.json(profile);
  } catch (err) {
    console.error(err.message);
    if (err.kind == 'ObjectId') {
      return res.status(400).json({ msg: 'Profile not found' });
    }
    res.status(500).send('Server Error');
  }
});

// @route   DELETE /api/profiles/:user_id
// @desc    Delete account (profile, user and his/her articles)
// @access  Private
router.delete('/:user_id', auth, async (req, res) => {
  const checkStatus = await compareUsers(req.user.id, req.params.user_id);
  if (checkStatus == 401 || checkStatus == 500)
    return res
      .status(checkStatus)
      .send({ msg: checkStatus == 401 ? 'Unauthorized' : 'Server Error' });

  try {
    //TODO Delete comments and articles

    // Delete profile
    await Profile.findOneAndRemove({ user: req.params.user_id });

    // Delete user
    await User.findOneAndRemove({ _id: req.params.user_id });
    res.json({ msg: 'Profile deleted' });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server Error');
  }
});

// @route   PUT /api/profiles/experience/:user_id
// @desc    Add profile experience
// @access  Private
router.put(
  '/experience/:user_id',
  [
    auth,
    [
      check('title', 'Title is required').not().isEmpty(),
      check('company', 'Company is required').not().isEmpty(),
      check('from', 'From date is required').not().isEmpty(),
    ],
  ],
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const checkStatus = await compareUsers(req.user.id, req.params.user_id);
    if (checkStatus == 401 || checkStatus == 500)
      return res
        .status(checkStatus)
        .send({ msg: checkStatus == 401 ? 'Unauthorized' : 'Server Error' });

    const { title, company, location, from, to, current, description } =
      req.body;

    const newExperience = {
      title,
      company,
      location,
      from,
      to,
      current,
      description,
    };

    try {
      const profile = await Profile.findOne({ user: req.params.user_id });
      profile.experience.unshift(newExperience);

      await profile.save();

      res.json(profile);
    } catch (err) {
      console.error(err.message);
      res.status(500).send('Server Error');
    }
  }
);

module.exports = router;