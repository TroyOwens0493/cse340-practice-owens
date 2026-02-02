import { getFacultyById, getSortedFaculty } from "../../models/faculty/faculty.js";

export const facultyListPage = (req, res) => {

    const currentSort = req.query.sort;

    const faculty = getSortedFaculty(currentSort);

    res.render('faculty/list', { title: 'Faculty', faculty, currentSort });
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
