const apiClient = require('../apiClient');

const fetchDepartmentList = async () => {
    const departmentData = await apiClient.department.getAll();

    return departmentData.content;
};

module.exports = {
    fetchDepartmentList,
};
