const HttpError = require("../models/http-error");
const Confession = require("../models/confession");
const mongoose = require("mongoose");

function getFormattedDate() {
    const date = new Date();
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, '0'); // getMonth() is 0-indexed
    const day = date.getDate().toString().padStart(2, '0');

    return `${year}-${month}-${day}`;
}
const getConfession = async (req, res, next) => {
    try {
        const confessions = await Confession.find();

        if (confessions.length === 0) {
            return next(new HttpError("No confessions found.", 404));
        }

        res.status(200).json({ confessions });
    } catch (error) {
        return next(new HttpError("Fetching confessions failed, please try again later.", 500));
    }
}

const createConfesion = async (req, res, next) => {
    const { content  } = req.body;
console.log(req.body);
    if (content?.trim().length === 0) {
        const err = new HttpError("there is no content", 500);
        return next(err)
    }
    const createdConfession = new Confession({
        date: getFormattedDate(),
        confessor_status: "anonymous",
        content: content,
    })

    const sess = await mongoose.startSession();
    try {
        sess.startTransaction();
        console.log("session started");

        await createdConfession.save({ session: sess });
        console.log("created confession saved");

        await sess.commitTransaction();
        console.log("transaction committed");

        sess.endSession();

        res.status(201).json({ confession: createdConfession });

    } catch (error) {
        await sess.abortTransaction();
        sess.endSession();
        return next(new HttpError("Create confession failed: " + error.message, 500));
    }

}

const updateConfession = async (req, res, next) => {
    const confessionId = req.params.cid;

    const { content } = req.body;

    let confession;

    try {
        confession = await Confession.findById(confessionId)
    } catch (error) {
        const err = new HttpError("could not find confession", 500);

        return next(err)
    }

    confession.content=content;

    try {
        await confession.save();
    } catch (error) {
        const err = new HttpError("saving gone wrong,try it again", 500);

        return next(err)
    }

    res.status(200).json({ confession: confession.toObject({ getters: true }) })
}
const deleteConfession = async (req, res, next) => {
    const { confessionId } = req.params;

    try {
        const result = await Confession.deleteOne({ confession_id: confessionId });

        if (result.deletedCount === 0) {
            return next(new HttpError("No confession found with that ID.", 404));
        }

        res.status(200).json({ message: "Confession deleted successfully." });
    } catch (error) {
        return next(new HttpError("Deleting confession failed, please try again later.", 500));
    }
}



exports.getConfession = getConfession;
exports.createConfesion = createConfesion;
exports.updateConfession = updateConfession;
exports.deleteConfession = deleteConfession;
