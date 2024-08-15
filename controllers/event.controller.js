import { ObjectId } from "mongodb";

import { getDb } from "../db/database.js";
import { asyncHandler } from "../utils/asyncHandler.js";
import { ApiError } from "../utils/ApiError.js";

const createEvent = asyncHandler( async (req, res) => {
    const db = getDb();

    const {
        name,
        tagline,
        description,
        moderator,
        category,
        sub_category,
        rigor_rank
    } = req.body;

    const { image } = req.file ? req.file.filename: null;
    const schedule = new Date();

    if(
        [name, tagline, description, moderator, category, sub_category, rigor_rank].some((field) => field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required")
    }

    const result = await db.collection('events').insertOne({
        name,
        tagline,
        schedule,
        description,
        image,
        moderator,
        category,
        sub_category,
        rigor_rank
    });

    if(!result){
        throw new ApiError(500, "Failed to create event")
    }

    res.status(201).json({
        message: "Event created successfully",
        data: result
        // data: result.ops[0]
    })

});

const getEventById = asyncHandler( async (req, res) => {
    const db = getDb();

    const event = await db.collection('events').findOne({
        _id: new ObjectId(req.query.id)
    });

    if(!event){
        throw new ApiError(404, "Event not found")
    }

    res.status(200).json({
        message: "Event found",
        data: event
    })
});

const getLatestEvents = asyncHandler( async(req, res) => {
    const db = getDb();

    const { type = 'latest', limit = 5 , page = 1} = req.query;
    
    const parsedLimit = parseInt(limit, 10);
    const parsedPage = parseInt(page, 10);
    const skip = (parsedPage - 1) * parsedLimit;

    if (isNaN(parsedLimit) || parsedLimit <= 0) {
        throw new ApiError(400, 'Invalid limit');
    }

    if (isNaN(parsedPage) || parsedPage <= 0) {
        throw new ApiError(400, 'Invalid page number');
    }

    let query = {};
    if (type === 'latest') {
        query = {}; 
    } else {
        throw new ApiError(400, 'Invalid type');
    }

    const events = await db.collection('events')
        .find(query)
        .sort({ schedule: -1 }) 
        .skip(skip)
        .limit(parsedLimit)
        .toArray();

    console.log('Query:', query);
    console.log('Fetched events:', events);

    if (events.length === 0) {
        throw new ApiError(404, 'No events found');
    }

    res.status(200).json({
        message: "Events found",
        data: events
    })
});

const updateEvent = asyncHandler(async (req, res) => {
    const db = getDb();

    const {
        name,
        tagline,
        description,
        moderator,
        category,
        sub_category,
        rigor_rank
    } = req.body

    const { image } = req.file ? req.file.filename : null;

    if(
        [name, tagline, description, moderator, category, sub_category, rigor_rank].some((field) => field?.trim()==="")
    ){
        throw new ApiError(400,"All fields are required")
    }

    await db.collection('events').updateOne(
        { _id: new ObjectId(req.params.id) },
        { $set: {
            name,
            tagline,
            description,
            image,
            moderator,
            category,
            sub_category,
            rigor_rank,
        }}
    );

    res.status(201).json({
        message: "Event updated",
    })
    
});

const deleteEvent = asyncHandler( async (req, res) => {
    const db = getDb();

    await db.collection('events').deleteOne({
        _id: new ObjectId(req.params.id)
    })

    res.status(200).json({
        message: "Event deleted",
    })
});

export {
    createEvent,
    getEventById,
    getLatestEvents,
    updateEvent,
    deleteEvent
}