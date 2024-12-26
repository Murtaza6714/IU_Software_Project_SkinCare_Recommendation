"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const shared_1 = require("../controllers/shared");
const router = (0, express_1.Router)();
router.get("/fetch", shared_1.AttributeController.fetchAttribute);
exports.default = router;
