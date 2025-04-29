const mongoose = require('mongoose');

const connectionRequestSchema = new mongoose.Schema({
    fromUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    toUserId: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
    },
    status: {
        type: String,
        required: true,
        enum: ["ignored", "interested", "accepted", "rejected"],
        messahe: `{VALUE} is not a valid status`,
    }
},
    { timestamps: true, }
);

// Middleware to check if the connection request is valid
connectionRequestSchema.index({ fromUserId: 1, toUserId: 1 }, { unique: true });


connectionRequestSchema.pre("save", function (next) {
    const connectionRequest = this;
    if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
        throw new Error("You cannot send a connection request to yourself...");
    }
    next();
})

const ConnecctionRequestModel = mongoose.model("ConnectionRequest", connectionRequestSchema);
module.exports = ConnecctionRequestModel;