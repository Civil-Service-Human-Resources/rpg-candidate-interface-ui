const apiClient = require('../apiClient');

const fetchDepartmentList = async (next) => {
    const departmentData = await apiClient.department.getAll(next);

    return departmentData.content;
};

module.exports = {
    fetchDepartmentList,
};
