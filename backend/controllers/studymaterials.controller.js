
// // 


// // ===============================
// // controllers/material.controller.js
// // ===============================

// const path = require('path');
// const fs = require('fs');
// const fsp = fs.promises;
// const Material = require('../models/Material.models');
// const { UPLOAD_DIR } = require('../middlewares/upload');
// const { isValidObjectId } = require('mongoose');

// // Optional deps (if installed). Fallbacks provided if not.
// let contentDisposition, mimeTypes;
// try { contentDisposition = require('content-disposition'); } catch { }
// try { mimeTypes = require('mime-types'); } catch { }

// function isOwnerOrAdmin(req, material) {
//     const isOwner = material.uploadedBy?.toString() === req.user?.id;
//     const isAdmin = req.user?.role === 'admin';
//     return isOwner || isAdmin;
// }
// /** Safe check that absPath is inside upload dir (prevents traversal) */
// function isInsideUploadDir(absPath, uploadDir) {
//     const rel = path.relative(uploadDir, absPath);
//     return !!rel && !rel.startsWith('..') && !path.isAbsolute(rel);
// }

// /** Resolve absolute on-disk path for a material document.
//  *  Prefer storedFilename (multer-generated) if present; fallback to legacy fileUrl.
//  */
// function resolveMaterialPath(mat) {
//     if (mat?.storedFilename) {
//         return path.join(UPLOAD_DIR, mat.storedFilename);
//     }
//     // Legacy fallback: fileUrl stored as "uploads/xxx.ext" relative to project root
//     const fromUrl = path.isAbsolute(mat.fileUrl)
//         ? mat.fileUrl
//         : path.join(process.cwd(), mat.fileUrl || '');
//     return fromUrl;
// }

// /** Create/upload */
// exports.createMaterial = async (req, res) => {
//     // Debug logs to help investigate upload issues
//     console.log('--- Upload attempt ---');
//     console.log('Authenticated user:', req.user && { id: req.user.id, email: req.user.email, role: req.user.role });
//     console.log('Request body:', req.body);
//     console.log('Req.file present?', !!req.file);

//     // Multer places file info on req.file
//     if (!req.file) {
//         console.warn('Upload failed: no file received (req.file is empty)');
//         return res.status(400).json({ message: 'File is required' });
//     }

//     const { course, semester, subject, description } = req.body;
//     if (!subject) {
//         console.warn('Upload failed: missing subject in req.body');
//         return res.status(400).json({ message: 'Subject is required' });
//     }

//     // Prefer storing just the server filename + metadata
//     const doc = await Material.create({
//         course: course || undefined,
//         semester: semester || undefined,
//         subject,
//         description: description || undefined,
//         storedFilename: req.file.filename,     // saved by multer
//         originalName: req.file.originalname,
//         mimetype: req.file.mimetype,
//         size: req.file.size,
//         uploadedBy: req.user.id,
//         // Optional: keep a friendly relative URL for older clients/UIs
//         fileUrl: `uploads/${req.file.filename}`,
//     });

//     return res.status(201).json({ message: 'Uploaded', data: doc });
// };


// /** List with filters + robust search + limit clamp */
// exports.listMaterials = async (req, res) => {
//     let { page = 1, limit = 20, course, semester, subject, q } = req.query;
//     page = Math.max(1, Number(page) || 1);
//     limit = Math.min(100, Math.max(1, Number(limit) || 20)); // cap 100
//     const skip = (page - 1) * limit;

//     const filter = {};
//     if (course) filter.course = course;
//     if (semester) filter.semester = semester;
//     if (subject) filter.subject = subject;

//     // Text search (requires text index); fallback to regex if not available
//     if (q) {
//         try {
//             await Material.init(); // ensure indexes
//             filter.$text = { $search: q };
//         } catch {
//             const safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
//             const rx = new RegExp(safe, 'i');
//             filter.$or = [{ subject: rx }, { description: rx }];
//         }
//     }

//     const [items, total] = await Promise.all([
//         Material.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
//         Material.countDocuments(filter),
//     ]);

//     return res.json({
//         data: items,
//         page,
//         limit,
//         total,
//         totalPages: Math.ceil(total / limit),
//     });
// };

// /** Get one (with invalid ObjectId guard) */
// exports.getMaterial = async (req, res) => {
//     const { id } = req.params;
//     if (!isValidObjectId(id)) return res.status(404).json({ message: 'Not found' });

//     const mat = await Material.findById(id);
//     if (!mat) return res.status(404).json({ message: 'Not found' });
//     return res.json({ data: mat });
// };


// exports.downloadMaterial = async (req, res) => {
//     const { id } = req.params;
//     if (!isValidObjectId(id)) return res.status(404).json({ message: 'Not found' });

//     const mat = await Material.findById(id);
//     if (!mat) return res.status(404).json({ message: 'Not found' });

//     const absolute = path.normalize(resolveMaterialPath(mat));
//     if (!isInsideUploadDir(absolute, UPLOAD_DIR)) {
//         return res.status(403).json({ message: 'Access denied' });
//     }

//     try {
//         await fsp.access(absolute, fs.constants.R_OK);
//     } catch {
//         return res.status(410).json({ message: 'File missing from server' });
//     }

//     // Content-Type
//     const type =
//         (mat.mimetype && typeof mat.mimetype === 'string' && mat.mimetype) ||
//         (mimeTypes && mimeTypes.lookup(mat.originalName || '')) ||
//         'application/octet-stream';
//     res.setHeader('Content-Type', type);

//     // Content-Length (nice UX; ignore errors)
//     try {
//         const stat = await fsp.stat(absolute);
//         if (stat?.size >= 0) res.setHeader('Content-Length', stat.size);
//     } catch { }

//     // Content-Disposition
//     if (contentDisposition) {
//         res.setHeader('Content-Disposition', contentDisposition(mat.originalName || 'download'));
//     } else {
//         const safeName = encodeURIComponent(mat.originalName || 'download');
//         res.setHeader('Content-Disposition', `attachment; filename="${safeName}"`);
//     }

//     const stream = fs.createReadStream(absolute);
//     stream.on('error', () => res.status(500).end());
//     return stream.pipe(res);
// };

// /** Delete (owner/admin) with safe unlink */
// exports.deleteMaterial = async (req, res) => {
//     const { id } = req.params;
//     if (!isValidObjectId(id)) return res.status(404).json({ message: 'Not found' });

//     const mat = await Material.findById(id);
//     if (!mat) return res.status(404).json({ message: 'Not found' });

//     if (!isOwnerOrAdmin(req, mat)) {
//         return res.status(403).json({ message: 'Forbidden' });
//     }

//     try {
//         const absolute = path.normalize(resolveMaterialPath(mat));
//         if (isInsideUploadDir(absolute, UPLOAD_DIR)) {
//             await fsp.unlink(absolute).catch(() => { });
//         }
//     } catch (_) { }

//     await mat.deleteOne();
//     return res.json({ message: 'Deleted' });
// };

// /** Update meta (owner/admin) */
// exports.updateMaterialMeta = async (req, res) => {
//     const { id } = req.params;
//     if (!isValidObjectId(id)) return res.status(404).json({ message: 'Not found' });

//     const mat = await Material.findById(id);
//     if (!mat) return res.status(404).json({ message: 'Not found' });
//     if (!isOwnerOrAdmin(req, mat)) return res.status(403).json({ message: 'Forbidden' });

//     const { course, semester, subject, description } = req.body;
//     if (subject !== undefined && !subject) {
//         return res.status(400).json({ message: 'Subject cannot be empty' });
//     }

//     if (course !== undefined) mat.course = course;
//     if (semester !== undefined) mat.semester = semester;
//     if (subject !== undefined) mat.subject = subject;
//     if (description !== undefined) mat.description = description;

//     await mat.save();
//     return res.json({ message: 'Updated', data: mat });
// };

// ===============================
// controllers/material.controller.js
// ===============================

// REMOVED: fs, path, and local directory logic


const cloudinary = require('../config/cloudinary.config');
const Material = require('../models/Material.models');
const { isValidObjectId } = require('mongoose');
const fs = require('fs');

// ========= Helper =========
function isOwnerOrAdmin(req, material) {
    return (
        material.uploadedBy?.toString() === req.user?.id ||
        req.user?.role === 'admin'
    );
}

// ========= 1. CREATE =========
exports.createMaterial = async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'File is required' });

        const { course, semester, subject, description } = req.body;
        if (!subject) {
            fs.unlinkSync(req.file.path);
            return res.status(400).json({ message: 'Subject is required' });
        }

        // Upload to Cloudinary (private)
        const uploadResult = await cloudinary.uploader.upload(req.file.path, {
            folder: 'course-materials',
            resource_type: 'auto',
            type: 'authenticated'
        });

        fs.unlinkSync(req.file.path);

        const doc = await Material.create({
            course: course || null,
            semester: semester || null,
            subject,
            description: description || null,
            storedFilename: uploadResult.public_id,
            originalName: req.file.originalname,
            mimetype: req.file.mimetype,
            size: req.file.size,
            uploadedBy: req.user.id,
            fileUrl: uploadResult.secure_url
        });

        return res.status(201).json({ message: 'Uploaded', data: doc });

    } catch (err) {
        console.error(err);
        return res.status(500).json({ message: 'Upload failed', error: err.message });
    }
};


// ========= 2. LIST MATERIALS =========
exports.listMaterials = async (req, res) => {
    let { page = 1, limit = 20, course, semester, subject, q } = req.query;

    page = Number(page) || 1;
    limit = Math.min(100, Number(limit) || 20);

    const skip = (page - 1) * limit;
    const filter = {};

    if (course) filter.course = course;
    if (semester) filter.semester = semester;
    if (subject) filter.subject = subject;

    // Text search
    if (q) {
        try {
            await Material.init();
            filter.$text = { $search: q };
        } catch {
            const safe = q.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const rx = new RegExp(safe, 'i');
            filter.$or = [{ subject: rx }, { description: rx }];
        }
    }

    const [items, total] = await Promise.all([
        Material.find(filter).sort({ createdAt: -1 }).skip(skip).limit(limit).lean(),
        Material.countDocuments(filter)
    ]);

    // ------ If frontend requested grouping ------
    if (String(req.query.group).toLowerCase() === 'true') {
        const byCourse = new Map();

        for (const m of items) {
            const courseName = m.course || 'General';
            const courseId = courseName.toLowerCase().replace(/\s+/g, '-');

            if (!byCourse.has(courseId)) {
                byCourse.set(courseId, {
                    id: courseId,
                    name: courseName,
                    icon: 'book',
                    subjects: []
                });
            }

            const fileTypeGuess = m.originalName?.split('.').pop().toLowerCase() ||
                                  m.mimetype?.split('/').pop() ||
                                  'file';

            byCourse.get(courseId).subjects.push({
                id: m._id,
                _id: m._id,
                title: m.subject || 'Untitled',
                subject: m.subject || 'Untitled',
                description: m.description || '',
                originalName: m.originalName,
                fileType: fileTypeGuess,
                fileUrl: m.fileUrl,
                mimetype: m.mimetype,
                storedFilename: m.storedFilename
            });
        }

        return res.json({
            data: Array.from(byCourse.values()),
            page, limit, total,
            totalPages: Math.ceil(total / limit)
        });
    }

    return res.json({ data: items, page, limit, total, totalPages: Math.ceil(total / limit) });
};


// ========= 3. GET ONE =========
exports.getMaterial = async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(404).json({ message: 'Not found' });

    const mat = await Material.findById(id);
    if (!mat) return res.status(404).json({ message: 'Not found' });

    return res.json({ data: mat });
};


// ========= 4. DOWNLOAD MATERIAL =========
exports.downloadMaterial = async (req, res) => {
    const { id } = req.params;
    if (!isValidObjectId(id)) return res.status(404).json({ message: 'Not found' });

    const mat = await Material.findById(id);
    if (!mat || !mat.storedFilename)
        return res.status(404).json({ message: 'File not found' });

    // PDFs / Docs must use RAW type in Cloudinary
    const resourceType = mat.mimetype.startsWith('image/')
        ? 'image'
        : 'raw';

    const signedUrl = cloudinary.url(mat.storedFilename, {
        type: 'authenticated',
        secure: true,
        resource_type: resourceType,
        sign_url: true,
        expires_at: Math.floor(Date.now() / 1000) + 3600,
        flags: 'attachment'
    });

    return res.redirect(signedUrl);
};


// ========= 5. DELETE MATERIAL =========
exports.deleteMaterial = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) return res.status(404).json({ message: 'Not found' });

    const mat = await Material.findById(id);
    if (!mat) return res.status(404).json({ message: 'Not found' });

    if (!isOwnerOrAdmin(req, mat))
        return res.status(403).json({ message: 'Forbidden' });

    if (mat.storedFilename) {
        try {
            await cloudinary.uploader.destroy(mat.storedFilename, { resource_type: 'raw' });
            await cloudinary.uploader.destroy(mat.storedFilename, { resource_type: 'image' });
        } catch (err) {
            console.error('Cloudinary deletion error:', err);
        }
    }

    await mat.deleteOne();
    return res.json({ message: 'Deleted' });
};


// ========= 6. UPDATE =========
exports.updateMaterialMeta = async (req, res) => {
    const { id } = req.params;

    if (!isValidObjectId(id)) return res.status(404).json({ message: 'Not found' });

    const mat = await Material.findById(id);
    if (!mat) return res.status(404).json({ message: 'Not found' });

    if (!isOwnerOrAdmin(req, mat))
        return res.status(403).json({ message: 'Forbidden' });

    const { course, semester, subject, description } = req.body;

    if (subject !== undefined && !subject)
        return res.status(400).json({ message: 'Subject cannot be empty' });

    if (course !== undefined) mat.course = course;
    if (semester !== undefined) mat.semester = semester;
    if (subject !== undefined) mat.subject = subject;
    if (description !== undefined) mat.description = description;

    await mat.save();

    return res.json({ message: 'Updated', data: mat });
};
