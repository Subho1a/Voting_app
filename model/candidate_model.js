const mongoose=require("mongoose");

const candidateSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    age: {
        type: Number,
        required: true
    },
    party: {
        type: String,
        required: true
    },
    
    votesReceived: [
        {
            user: {
                type: mongoose.Schema.Types.ObjectId,
                ref: 'User',
                required: true
            },
            votedAt: {
                type: Date,
                default: Date.now
            }
        }

    ],
    voteCount: {
        type: Number,
        default: 0
    },
})

const candidate= mongoose.model("Candidate", candidateSchema);
module.exports = candidate;