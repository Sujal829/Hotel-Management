const express = require('express');
const router = express.Router();
const QRCode = require('qrcode');
const { adminAuth } = require('../middleware/auth');

// GET /api/qr - Generate QR code for the logged-in admin
router.get('/', adminAuth, async (req, res) => {
    try {
        const adminId = req.user._id.toString();
        const { table } = req.query; // Optional table number

        // In local dev, use the IP address if you want to scan with a physical phone
        let frontendUrl = process.env.FRONTEND_URL || 'http://localhost:5173';
        
        // Ensure no trailing slash for consistent concatenation
        frontendUrl = frontendUrl.replace(/\/$/, '');

        let menuUrl = `${frontendUrl}/menu/${adminId}`;
        
        // Add table parameter if provided
        if (table) {
            menuUrl += `?table=${table}`;
        }

        // Generate a high-quality QR code
        const qrCodeDataUrl = await QRCode.toDataURL(menuUrl, {
            margin: 2,
            width: 500,
            color: {
                dark: '#000000',
                light: '#ffffff'
            }
        });

        res.json({
            qrCode: qrCodeDataUrl,
            menuUrl,
            adminId: adminId,
            table: table || null
        });
    } catch (err) {
        console.error('QR code generation failed:', err);
        res.status(500).json({ message: 'Failed to generate QR code' });
    }
});

module.exports = router;
