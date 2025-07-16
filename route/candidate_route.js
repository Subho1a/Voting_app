const express = require('express');
const router = express.Router();
const User = require('../model/user_model'); // ✅ Correct model name
const candidate = require('../model/candidate_model.js'); // ✅ Correct model name
const { jwtAuthenticationMiddleware, generateToken } = require('../jwt');

// const { jwtAuthenticationMiddleware } = require('./jwt');
const checkAdminRole=async(userID)=>{
   try {
    const user= await User.findById(userID);
    return user.role=== 'admin';
    
   } catch (error) {
       console.error('Error checking admin role:', error);
       throw error;
    
   }
}

// post route to add candidate
router.post('/', jwtAuthenticationMiddleware, async (req, res) => {
    try {
        const isAdmin = await checkAdminRole(req.user.id);
        if (!isAdmin) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const data = req.body; //assuming data contains candidate details
        const newcandidate = new candidate(data);
        const response = await newcandidate.save();
        console.log('Data saved');


        res.status(200).json({ response, message: 'Candidate added successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});




// Update candidate 

router.put('/:candidateID', jwtAuthenticationMiddleware, async (req, res) => {
    try {
        const isAdmin = await checkAdminRole(req.user.id);
        if (!isAdmin) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const candidateID = req.params.candidateID;
        const updatedCandidateData = req.body; //assuming data contains updated candidate details

        const candidate = await candidate.findByIdAndUpdate(candidateID, updatedCandidateData, { new: true });
        if (!candidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        res.status(200).json({ candidate, message: 'Candidate updated successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

//delete candidate
router.delete('/:candidateID', jwtAuthenticationMiddleware, async (req, res) => {
    try {
        const isAdmin = await checkAdminRole(req.user.id);
        if (!isAdmin) {
            return res.status(403).json({ error: 'Forbidden' });
        }

        const candidateID = req.params.candidateID;
        const deletedCandidate = await candidate.findByIdAndDelete(candidateID);
        if (!deletedCandidate) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        res.status(200).json({ message: 'Candidate deleted successfully' });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



// Vote for a candidate
router.post('/vote/:candidateID', jwtAuthenticationMiddleware, async (req, res) => {
    try {
        const candidateID = req.params.candidateID;
        const userId = req.user.id;

        // Prevent admin from voting
        const voter = await User.findById(userId);
        if (!voter || voter.role === 'admin') {
            return res.status(403).json({ error: 'Admins cannot vote' });
        }

        // Check if user has already voted
        if (voter.isVoted) {
            return res.status(400).json({ error: 'You have already voted' });
        }

        // Check if candidate exists
        const candidateToVote = await candidate.findById(candidateID);
        if (!candidateToVote) {
            return res.status(404).json({ error: 'Candidate not found' });
        }

        // Add vote to candidate
        candidateToVote.votesReceived.push({
            user: userId,
            votedAt: new Date() // optional; defaults to Date.now in schema
        });
        candidateToVote.voteCount += 1;
        await candidateToVote.save();

        // Mark user as voted
        voter.isVoted = true;
        await voter.save();

        res.status(200).json({ message: 'Vote cast successfully' });
    } catch (error) {
        console.error('Error casting vote:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});



//vote count
router.get('/vote/count',async (req, res) => {
    try {
const candi_data = await candidate.find().sort({voteCount: -1});

//map to get only candidate name and vote count
const voteCountData = candi_data.map(data => ({
    name: data.party,
    voteCount: data.voteCount
}));
        res.status(200).json(voteCountData);
        console.log('Vote count fetched successfully');

    }
    catch (error) {
        console.error('Error fetching vote count:', error);
        res.status(500).json({ error: 'Internal server error' });
    }
});

module.exports = router;
