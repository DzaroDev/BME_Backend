const companyRepository = require('../repositories/company.repository');
const blogRepository = require('../repositories/blog.repository');

module.exports = {
  getPageContent: async (req, res, next) => {
    const companyList = await companyRepository.findAllCompaniesWithMinimalFields({}, {
      pageNo: 1,
      pageSize: 5,
      sortBy: 'createdAt',
      sortOrder: '1'
    })
    const blogList = await blogRepository.findAllBlogsWithMinimalFields({}, {
      pageNo: 1,
      pageSize: 3,
      sortBy: 'createdAt',
      sortOrder: '1'
    })
    return res.json({ statusCode: 200, data: { companyList, blogList } });
  },
}