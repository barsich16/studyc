export const userAPI = {
    async getProfile(token) {
        const response = await fetch('http://localhost:3000/api/user/profile', {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return await response.json();
    },
    async getClass(token, classId) {
        const response = await fetch(`api/user/class/${classId}`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return await response.json();
    },
    async getMarks(token) {
        const response = await fetch(`api/user/marks`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return await response.json();
    },
}

export const teachAPI = {
    async getMarks(token) {
        const response = await fetch(`api/teach/marks`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
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
    async getSubjects(token) {
        const response = await fetch(`http://localhost:3000/api/teach/subjects`, {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });
        return await response.json();
    },
}
