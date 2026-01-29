import { getFacultyById, getSortedFaculty } from "../../models/faculty/faculty.js";

export const facultyListPage = (req, res) => {

    const faculty = getSortedFaculty();
    console.log('faculty', faculty);

    res.render('faculty/list', { title: 'Faculty', faculty });
};

export const facultyDetailPage = (req, res, next) => {

    const facultyId = req.params.facultyId;

    const faculty = getFacultyById(facultyId);

    if (!faculty) {

        const err = new Error(`Course ${facultyId} not found`);

        err.status = 404;

        return next(err);

    }

    res.render('faculty/detail', {

        title: `${faculty.name} - ${faculty.department}`,

        faculty

    });

};
