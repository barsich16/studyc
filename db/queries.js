const queries = {
    deleteMark: `DELETE FROM "Marks" where pupil_id = $1 and subject_id = $2 and event_id = $3 and mark = $4`,
    addMark: `INSERT INTO "Marks" (pupil_id, subject_id, event_id, mark, creation_date) VALUES ($1, $2, $3, $4, CURRENT_DATE)`,
    updateMark: `UPDATE "Marks" SET mark = $4 where pupil_id = $1 and subject_id = $2 and event_id = $3`,
}
module.exports = queries
