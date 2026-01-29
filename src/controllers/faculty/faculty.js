import { getSortedFaculty } from "../../models/faculty/faculty.js";

export const facultyListPage = (req, res) => {

    const faculty = getSortedFaculty();

    res.render('faculty/list', { title: 'Faculty', faculty });
};

export const facultyDetailPage = (req, res, next) => {
};
