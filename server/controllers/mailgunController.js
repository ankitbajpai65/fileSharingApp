const { Router } = require('express');
const mailgunService = require('../services/mailgunService');

const router = Router();

router.post('/', async (req, res) => {
    console.log(`sendMail route hit`);
    // console.log(req.body);
    try {
        const response = await mailgunService.sendMail(req, res);
        console.log(response);
        console.log(response.json());
        // res.status(200).json({
        //     status: 'success',
        //     message: 'Email send successfully',
        //     data: response,
        // });
    } catch (error) {
        res.status(400).json({
            status: "error",
            message: "Email not sent",
            error:error
        });
    }
});

module.exports = router;