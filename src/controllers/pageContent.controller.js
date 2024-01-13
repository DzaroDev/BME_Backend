const companyRepository = require('../repositories/company.repository');
const blogRepository = require('../repositories/blog.repository');
const jobPostingRepository = require('../repositories/jobPosting.repository');

module.exports = {
  getPageContent: async (req, res, next) => {
    let companyList = await companyRepository.findAllCompaniesWithMinimalFields({}, {
      pageNo: 1,
      pageSize: 5,
      sortBy: 'createdAt',
      sortOrder: '1'
    })

    // transformed company result
    companyList = companyList?.map((company) => ({
      id: company?.id || '',
      name: company?.name || '',
      description: company?.description || '',
      image: company?.logoImage || '',
    }))

    let blogList = await blogRepository.findAllBlogsWithMinimalFields({}, {
      pageNo: 1,
      pageSize: 3,
      sortBy: 'createdAt',
      sortOrder: '1'
    })

    // transformed blogs result
    blogList = blogList?.map((blog) => ({
      id: blog?.id || '',
      name: blog?.titleText || '',
      description: blog?.description || '',
      image: blog?.images?.[0] || '',
    }))

    let jobPostList = await jobPostingRepository.findAllJobPostsWithMinimalFields({}, {
      pageNo: 1,
      pageSize: 4,
      sortBy: 'createdAt',
      sortOrder: '1'
    })

    // transformed job posts result
    jobPostList = jobPostList?.map((jobPost) => ({
      id: jobPost?.id || '',
      name: jobPost?.jobTitle || '',
      description: jobPost?.jobDescription || '',
      image: '',
    }))
    
    return res.json({ statusCode: 200, data: { companyList, blogList, jobPostList } });
  },
}