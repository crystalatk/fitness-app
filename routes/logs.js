'use strict';

const express = require('express'),
    router = express.Router(),
    WorkoutModel = require('../models/workoutModel'),
    UserModel = require('../models/usersModel');

// Get
router.get('/workout/:workout_id', async (req, res, next) => {
    const { workout_id } = req.params;
    const workoutDetails = await WorkoutModel.getWorkoutById(workout_id);
    const partsList = await WorkoutModel.getPartsByWorkoutId(workout_id);
    const user_id = req.session.user_id;
    const userInfo = await UserModel.getUserInfo(user_id);
    res.render('template', {
        locals: {
            title: workoutDetails.name,
            is_logged_in: req.session.is_logged_in,
            workoutDetails,
            partsList,
            userInfo
        },
        partials: {
            body: "partials/workout",
            header: "partials/header"
        }
    });
});

router.get('/userworkout/:workout_id', async (req, res, next) => {
    const { workout_id } = req.params;
    const workoutDetails = await WorkoutModel.getUserWorkoutById(workout_id);
    const user_id = req.session.user_id;
    const userInfo = await UserModel.getUserInfo(user_id);
    res.render('template', {
        locals: {
            title: workoutDetails.name,
            is_logged_in: req.session.is_logged_in,
            workoutDetails,
            userInfo
        },
        partials: {
            body: "partials/userworkout",
            header: "partials/header"
        }
    });
});

router.get('/loggedworkouts', async (req, res, next) => {
    const user_id = req.session.user_id;
    console.log("I am Here!");
    const userInfo = await UserModel.getUserInfo(user_id);
    const loggedWorkouts = await UserModel.getLoggedWorkouts(user_id);
    res.render('template', {
        locals: {
            title: "Logged Workouts",
            is_logged_in: req.session.is_logged_in,
            userInfo,
            loggedWorkouts,
        },
        partials: {
            body: "partials/logged_workouts",
            header: "partials/header"
        }
    });
})

// Posts
router.post('/log_user_workout', async (req, res, next) => {
    const { id, weight, reps, type_id } = req.body;
    const user_id = req.session.user_id;
    const newLoggedWorkout = await WorkoutModel.logUserWorkout(id, weight, null, null, reps, user_id);
    res.redirect(`/workouts/${type_id}`);
});

router.post('/add_workout', async (req, res, next) => {
    const { id, weight=null, reps=null, duration=null, distance=null, type_id, user_weight } = req.body;
    const user_id = req.session.user_id;
    console.log("THESE ARE OUR DATA POINTS FOR LOGGING A WORKOUT:", weight, reps, duration, distance);
    const calories_burned = distance ? Math.round(distance * 1.6 * user_weight * .45 * 1.036) : null;
    console.log("CALORIES BURNED",calories_burned);
    const newLoggedWorkout = await WorkoutModel.logWorkout(id, weight, duration, distance, reps, user_id, calories_burned);
    res.redirect(`/workouts/${type_id}`);
});

module.exports = router;