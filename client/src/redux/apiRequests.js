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
            console.log("Обробити помилку")
        }

    },
    async login(values) {
        try {
            const response = await fetch('http://localhost:3000/api/auth/login', {
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
            console.log("Обробити помилку")
        }
    },
    async getProfile(token) {
        try {
            const response = await fetch('http://localhost:3000/api/user/profile', {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            // if (response.status === 401) {
            //     throw new
            // }
            const responseJSON = await response.json();
            if (responseJSON.JWTExpired) {
                throw new Error(responseJSON.message)
            }
            return responseJSON;
        }
        catch (e) {
            throw e
        }

    },
    async getClass(token, classId) {
        const response = await fetch(`api/user/class/${classId}`, {
            // headers: {
            //     Authorization: `Bearer ${token}`
            // }
        });
        const responseJSON = await response.json();
        if (responseJSON.JWTExpired) {
            throw new Error(responseJSON.message)
        }
        return responseJSON;
    },
    async getMarks(userId) {
        const response = await fetch(`api/user/marks/${userId}`);
        return await response.json();
    },
    async updateProfileInfo(token, updatedProfileInfo) {
        try {
            console.log(updatedProfileInfo);
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
            console.log(e);
            throw e;
        }
    },
}

export const teachAPI = {
    async getMarks(userId) {
        const response = await fetch(`api/teach/marks/${userId}`);
        return await response.json();
    },
    async updateMark(token, subjectName, newMarks) {
        try {
            console.log("HERE");
            const obj = {subjectName, newMarks};
            const response = await fetch(`api/teach/marks/update`, {
                method: 'PUT',
                body: JSON.stringify(obj),
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
            console.log(e);
            throw e;
        }
    },
    async getSubjects(userId) {
        const response = await fetch(`http://localhost:3000/api/teach/subjects/${userId}`);
        return await response.json();
    },
    async updateSubject(token, newSubjectInfo) {
        try {
            console.log(newSubjectInfo);
            const response = await fetch(`http://localhost:3000/api/teach/subjects`, {
                method: 'PUT',
                body: JSON.stringify(newSubjectInfo),
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
            console.log(e);
            throw e;
        }
    },
}
export const adminAPI = {
    async createSchool(newSchoolInfo) {
        try {
            console.log('даров')
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
            console.log("Обробити помилку")
        }
    },
    async getEmployees(token) {
        const response = await fetch(`http://localhost:3000/api/admin/employees`, {
            method: 'GET',
            headers: {
                Authorization: `Bearer ${token}`,
                'Content-Type': 'application/json'
            }});
        console.log(response);
        return await response.json();
    },
}
