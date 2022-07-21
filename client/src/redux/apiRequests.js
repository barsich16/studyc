import {$authHost} from "./api-config";
import axios from "axios";

const $noAauthHost = axios.create({
    baseURL: 'http://localhost:3000'
});
export const userAPI = {
    async register(values) {
        try {
            const response = await fetch('http://localhost:3000/api/auth/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(values)
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Щось не так')
            }
            return data;
        } catch (e) {
            throw e;
        }

    },
    async login(values) {
        try {
            const response = $noAauthHost.post('/api/auth/login', values)
                .then(response => response.data)
                .catch(error => {
                    if (error.response) {
                        throw new Error(error.response.data.message);
                    } else {
                        console.log(error);
                    }
                });

            return response;
        } catch (e) {
            throw e;
        }
    },
    async getProfile() {
        try {
            const resp = $authHost.get('/api/user/profile')
                .then(response => response.data)
                .catch(error => {
                    if (error.response) {
                        throw new Error(error.response.data.message);
                    } else {
                        console.log(error);
                    }
                });
            return resp;
        }
        catch (e) {
            throw e
        }

    },
    async getClass() {
        try {
            const resp = $authHost.get(`/api/user/class`)
                .then(response => response.data)
                .catch(error => {
                    if (error.response) {
                        throw new Error(error.response.data.message);
                    } else {
                        console.log(error);
                    }
                });
            return resp;
        }
        catch (e) {
            throw e
        }
    },
    async getAllMarks(userId) {
        const resp = $authHost.get(`/api/user/marks/${userId}`)
            .then(response => response.data)
            .catch(error => {
                if (error.response) {
                    throw new Error(error.response.data.message);
                } else {
                    console.log(error);
                }
            });
        return resp;
    },
    async getMarks(userId, subjectId) {
        const resp = $authHost.get(`/api/user/marks/${userId}/${subjectId}`)
            .then(response => response.data)
            .catch(error => {
                if (error.response) {
                    throw new Error(error.response.data.message);
                } else {
                    console.log(error);
                }
            });
        return resp;

    },
    async updateProfileInfo(token, updatedProfileInfo) {
        try {
            const response = await fetch(`http://localhost:3000/api/user/profile`, {
                method: 'PUT',
                body: JSON.stringify(updatedProfileInfo),
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Щось не так')
            }
            return data;
        } catch (e) {
            throw e;
        }
    },
    async getSchedule(classId) {
        try {
            const response = $authHost.get(`/api/user/schedule/${classId}`)
                .then(response => response.data)
                .catch(error => {
                    if (error.response) {
                        throw new Error(error.response.data.message);
                    } else {
                        console.log(error);
                    }
                });

            return response;
        } catch (e) {
            throw e;
        }
    },

    async getMySchedule() {
        try {
            const response = $authHost.get(`/api/user/schedule`)
                .then(response => response.data)
                .catch(error => {
                    if (error.response) {
                        throw new Error(error.response.data.message);
                    } else {
                        console.log(error);
                    }
                });

            return response;
        } catch (e) {
            throw e;
        }
    },
}

export const teachAPI = {
    async getMarks(subjectId) {
        const resp = $authHost.get(`/api/teach/marks/${subjectId}`)
            .then(response => response.data)
            .catch(error => {
                if (error.response) {
                    throw new Error(error.response.data.message);
                } else {
                    console.log(error);
                }
            });
        return resp;
    },

    async getTypesEvents() {
        const resp = $authHost.get(`/api/teach/typesEvents`)
            .then(response => response.data)
            .catch(error => {
                if (error.response) {
                    throw new Error(error.response.data.message);
                } else {
                    console.log(error);
                }
            });
        return resp;
    },

    async updateMark(changedMarks) {
        try {
            const response = $authHost.put('/api/teach/marks', changedMarks)
                .then(response => response.data)
                .catch(error => {
                    if (error.response) {
                        throw new Error(error.response.data.message);
                    } else {
                        console.log(error);
                    }
                });
            return response;
        } catch (e) {
            throw e;
        }
    },
    async getSubjects(userId) {
        const response = await fetch(`http://localhost:3000/api/teach/subjects/${userId}`);
        return await response.json();
    },
    async getPlans() {
        try {
            const response = $authHost.get('/api/teach/plans')
                .then(response => response.data)
                .catch(error => {
                    if (error.response) {
                        throw new Error(error.response.data.message);
                    } else {
                        console.log(error);
                    }
                });
            return response;
        } catch (e) {
            console.log(e);
            throw e;
        }
    },
    async updateSubject(newSubjectInfo) {
        try {
            const response = $authHost.put('/api/teach/subjects', newSubjectInfo)
                .then(response => response.data)
                .catch(error => {
                    if (error.response) {
                        throw new Error(error.response.data.message);
                    } else {
                        console.log(error);
                    }
                });

            return response;
        } catch (e) {
            console.log(e);
            throw e;
        }
    },
    async updatePlans(newPlansInfo) {
        try {
            const response = $authHost.put('/api/teach/plans', newPlansInfo)
                .then(response => response.data)
                .catch(error => {
                    if (error.response) {
                        throw new Error(error.response.data.message);
                    } else {
                        console.log(error);
                    }
                });
            return response;
        } catch (e) {
            throw e;
        }
    },
    async deletePlan(planId) {
        try {
            const response = $authHost.delete('/api/teach/plans', {data: {planId}})
                .then(response => response.data)
                .catch(error => {
                    if (error.response) {
                        throw new Error(error.response.data.message);
                    } else {
                        console.log(error);
                    }
                });
            return response;
        } catch (e) {
            console.log(e);
            throw e;
        }
    },
}
export const adminAPI = {
    async createSchool(newSchoolInfo) {
        try {
            const response = await fetch('http://localhost:3000/api/auth/createSchool', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newSchoolInfo)
            });
            const data = await response.json();
            if (!response.ok) {
                throw new Error(data.message || 'Щось не так')
            }
            return data;
        } catch (e) {
            throw e;
        }
    },
    
    async createClass(newClassInfo) {
        try {
            const response = $authHost.post('/api/admin/classes', newClassInfo)
                .then(response => response.data)
                .catch(error => {
                    if (error.response) {
                        throw new Error(error.response.data.message);
                    } else {
                        console.log(error);
                    }
                });
            return response;
        } catch (e) {
            throw e;
        }
    },
    
    async appointClassTeacher(classId, teacherId) {
        try {
            const response = $authHost.put('/api/admin/classTeacher', {classId, teacherId})
                .then(response => response.data)
                .catch(error => {
                    if (error.response) {
                        throw new Error(error.response.data.message);
                    } else {
                        console.log(error);
                    }
                });
            return response;
        } catch (e) {
            throw e;
        }
    },
    
    async updateSchedule(newSchedule) {
        try {
            const response = $authHost.put(`/api/admin/schedule`, newSchedule)
                .then(response => response.data)
                .catch(error => {
                    if (error.response) {
                        throw new Error(error.response.data.message);
                    } else {
                        console.log(error);
                    }
                });
            return response;
        } catch (e) {
            console.log(e);
            throw e;
        }
    },

    async updateAppointment(changedSubjects) {
        try {
            const response = $authHost.put('/api/admin/appointment', changedSubjects)
                .then(response => response.data)
                .catch(error => {
                    if (error.response) {
                        throw new Error(error.response.data.message);
                    } else {
                        console.log(error);
                    }
                });
            return response;
        } catch (e) {
            throw e;
        }
    },
    
    async getEmployees() {
        return $authHost.get('/api/admin/employees').then(response => response.data)
    },

    async getClasses() {
        return $authHost.get('/api/admin/classes').then(response => response.data)
    },

    async getAppointment(classId) {
        return $authHost.get(`/api/admin/appointment/${classId}`).then(response => response.data);
    },

    async getAllClassSubjects(classId, year) {
        return $authHost.get(`/api/admin/classes/${classId}/${year}`).then(response => response.data);
    },

    async changeState(employees_id, newState) {
        return $authHost.put('/api/admin/changeState', {id: employees_id, state: newState})
            .then(response => response.data)
            .catch(error => {
                if (error.response) {
                    throw new Error(error.response.data.message);
                } else {
                    console.log(error);
                }
            });
    },

    async changeEmployeeRole(employees_id, newRole) {
        return $authHost.put('/api/admin/roleEmployees', {id: employees_id, role: newRole})
            .then(response => response.data)
            .catch(error => {
                if (error.response) {
                    throw new Error(error.response.data.message);
                } else {
                    console.log(error);
                }
            });
    },

    async moveToNextYear(withSubjects) {
        return $authHost.put('/api/admin/changeYear', {withSubjects})
            .then(response => response.data)
            .catch(error => {
                if (error.response) {
                    throw new Error(error.response.data.message);
                } else {
                    console.log(error);
                }
            });
    },
}
