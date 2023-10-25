const memberModel = require('../models/member.model');

module.exports = {
  saveCompanyMember: async (companyId, member) => {
    if (!companyId) return false;
    member = {
      company: companyId,
      isActive: true, // active by default
      ...member, // member info
    }
    member = new memberModel(member);
    return await member.save();
  },
  saveManyCompanyMember: async (companyId, members) => {
    if (!companyId) return false;
    members = members.map(member => ({
      ...member,
      isActive: true, // active by default
      company: companyId, // assign companyId
    }));
    const output = await memberModel.insertMany(members);
    return output;
  },
}
