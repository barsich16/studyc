export const sortRowBySurname = (a, b) => {
    if (a.surname < b.surname) {
        return -1
    } else if (a.surname > b.surname)
        return 1
    else {
        return 0
    }
}

export const sortPlansBySemester = (a, b) => a.semester - b.semester;

export const isObjectsEqual = (object1, object2) => {  //лише для об'єктів які не мають вкладених об'єктів
    const props1 = Object.getOwnPropertyNames(object1);
    const props2 = Object.getOwnPropertyNames(object2);

    if (props1.length !== props2.length) {
        return false;
    }

    for (let i = 0; i < props1.length; i += 1) {
        const prop = props1[i];

        if (object1[prop] !== object2[prop]) {
            return false;
        }
    }

    return true;
}

export const getChangedMarks = (oldMarks, newMarks) => {
    const deletedMarks = [], addedMarks = [], updatedMarks = [];

    const searchChangedMarks = (changedKeysArray, storageArray, searchingArray, pupilKey, index) => {
        const marks = {};
        if (changedKeysArray.length > 0) {
            changedKeysArray.forEach(item => {
                marks[item] = searchingArray[index][item]; //заповнюємо об'єкт де ключ - id івента, значення - оцінка Ex: {81: 12, 82: 12}
            })
            storageArray.push({marks, pupil_id: pupilKey}) //додаємо
        }
    }

    newMarks.forEach((item, index) => {
        const oldKeys = Object.keys(oldMarks[index]);
        const newKeys = Object.keys(item);

        const deletedKeys = oldKeys.filter((e)=>!~newKeys.indexOf(e)); //ті оцінки що є в oldMarks і немає в newMarks
        const addedKeys = newKeys.filter((e)=>!~oldKeys.indexOf(e)); //ті оцінки що є в newMarks і немає в oldMarks
        const updatedKeys = newKeys.filter(item => oldKeys.includes(item) && oldMarks[index][item] != newMarks[index][item]); //ті що змінили значення

        searchChangedMarks(deletedKeys, deletedMarks, oldMarks, item.key, index);
        searchChangedMarks(addedKeys, addedMarks, newMarks, item.key, index);
        searchChangedMarks(updatedKeys, updatedMarks, newMarks, item.key, index);
    });

    return {deletedMarks, addedMarks, updatedMarks};
}

export const getChangedEvents = (oldEvents, newEvents) => {
    const oldIds = oldEvents.map(item => item.id);
    const newIds = newEvents.map(item => item.id);

    const addedEvents = newEvents.filter(item => !item.id); //в нових подіях немає id

    const deletedKeys = oldIds.filter((e)=>!~newIds.indexOf(e));
    const deletedEvents = oldEvents
        .filter(item => deletedKeys.includes(item.id))
        .map(item => item.id);

    const updatedEvents = newEvents.filter(newEventsItem => {
        let oldEventsItem = oldEvents.find(item => item.id === newEventsItem.id);
        return oldEventsItem ? !isObjectsEqual(newEventsItem, oldEventsItem) : false;
    })

    return {addedEvents, deletedEvents, updatedEvents}
}
