const express = require('express');
const router = express.Router();
const multer = require('multer');
const path = require('path');
const Category = require('../models/Category');
const Menu = require('../models/Menu');
const { adminAuth } = require('../middleware/auth');

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, `menu-${Date.now()}${path.extname(file.originalname)}`),
});
const upload = multer({ storage });

// Categories
router.get('/categories', async (req, res) => {
    const categories = await Category.find();
    res.json(categories);
});

router.post('/categories', adminAuth, upload.single('image'), async (req, res) => {
    const { name, description } = req.body;
    const category = new Category({
        name,
        description,
        image: req.file ? `/uploads/${req.file.filename}` : '',
    });
    await category.save();
    res.json(category);
});

router.put('/categories/:id', adminAuth, upload.single('image'), async (req, res) => {
    const update = { ...req.body };
    if (req.file) update.image = `/uploads/${req.file.filename}`;
    const category = await Category.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(category);
});

router.delete('/categories/:id', adminAuth, async (req, res) => {
    await Category.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Category deleted' });
});

// Menu
router.get('/', async (req, res) => {
    const menu = await Menu.find().populate('category');
    res.json(menu);
});

router.post('/', adminAuth, upload.single('image'), async (req, res) => {
    const {
        name,
        description,
        originalPrice,
        discountPercentage,
        category,
        isVeg,
        isAvailable,
    } = req.body;

    const item = new Menu({
        name,
        description,
        originalPrice: Number(originalPrice),
        discountPercentage: Number(discountPercentage || 0),
        category,
        image: req.file ? `/uploads/${req.file.filename}` : '',
        isVeg: isVeg === 'true' || isVeg === true,
        isAvailable: isAvailable === 'false' ? false : true,
    });
    await item.save();
    res.json(item);
});

router.put('/:id', adminAuth, upload.single('image'), async (req, res) => {
    const update = { ...req.body };
    if (update.originalPrice != null) update.originalPrice = Number(update.originalPrice);
    if (update.discountPercentage != null) update.discountPercentage = Number(update.discountPercentage);
    if (req.file) update.image = `/uploads/${req.file.filename}`;
    if (update.isVeg != null) update.isVeg = update.isVeg === 'true' || update.isVeg === true;
    if (update.isAvailable != null) update.isAvailable = !(update.isAvailable === 'false' || update.isAvailable === false);

    const item = await Menu.findByIdAndUpdate(req.params.id, update, { new: true });
    res.json(item);
});

router.delete('/:id', adminAuth, async (req, res) => {
    await Menu.findByIdAndDelete(req.params.id);
    res.json({ msg: 'Item deleted' });
});

module.exports = router;
