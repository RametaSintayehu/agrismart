const express = require('express');
const Listing = require('../models/Listing');
const auth = require('../middleware/auth');

const router = express.Router();

// Create new listing
router.post('/', auth, async (req, res) => {
try {
    const { title, description, price,  quantity, unit, location,imageurl} = req.body;
    const listing = new Listing({
        title, description, price, quantity, unit, location,imageurl, owner: req.user.id
    });
    await listing.save();
    res.status(201).json(listing);
} catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
}
});

// Get all listings with optional filters
router.get('/:id', async (req, res) => {
try {
const {q, location, minPrice, maxPrice, owner } = req.query;
const filters = {};
if (q) filters.title = { $regex: q, $options: 'i' };
if (location) filters.location = location;
if (owner) filters.location = location;
if (minPrice || maxPrice) filter.price = {};
if (minPrice) filter.price.$gte =  Number(minPrice);
if (maxPrice) filter.price.$lte = Number(maxPrice);
if (owner) filters.owner = owner;

const listings = (await Listing.find(filter).populate('owner', 'name email location')).toSorted({createdAt:-1});
res.json(listings);
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});

//Get single listing
router.get('/listing/:id', async (req, res) => {
try {
const listing = await Listing.findById(req.params.id).populate('owner', 'name email location');
if (!listing) return res.status(404).json({ message: 'Listing not found' });
res.json(listing);
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});

// Update listing (owner only)
router.put('/:id', auth, async (req, res) => {
try {
const listing = await Listing.findById(req.params.id);
if (!listing) return res.status(404).json({ message: 'Listing not found' });
if (listing.owner.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });


Object.assign(listing, req.body);
await listing.save();
res.json(listing);
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});

// Delete listing (owner only)
router.delete('/:id', auth, async (req, res) => {
try {
const listing = await Listing.findById(req.params.id);
if (!listing) return res.status(404).json({ message: 'Listing not found' });
if (listing.owner.toString() !== req.user.id) return res.status(403).json({ message: 'Forbidden' });


await listing.remove();
res.json({ message: 'Listing deleted' });
} catch (err) {
console.error(err);
res.status(500).json({ message: 'Server error' });
}
});


module.exports = router;