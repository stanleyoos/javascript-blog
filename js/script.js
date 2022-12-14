// document.getElementById('my-button').addEventListener('click', () => {
//   const links = document.querySelectorAll('.titles a')
//   console.log(links)
// })

//
'use strict'

const templates = {
  articleLink: Handlebars.compile(
    document.querySelector('#template-article-link').innerHTML
  ),
  tagLink: Handlebars.compile(
    document.querySelector('#template-tag-link').innerHTML
  ),
  authorLink: Handlebars.compile(
    document.querySelector('#template-author-link').innerHTML
  ),
  tagCloudLink: Handlebars.compile(
    document.querySelector('#template-tagcloud-link').innerHTML
  ),
  authorCloudLink: Handlebars.compile(
    document.querySelector('#template-authorcloud-link').innerHTML
  ),
}

const titleClickHandler = function (e) {
  e.preventDefault()
  const clickedElement = this

  /* [DONE] remove class 'active' from all article links  */
  const activeLinks = document.querySelectorAll('.titles a.active')

  for (let activeLink of activeLinks) {
    activeLink.classList.remove('active')
  }

  /* [DONE] add class 'active' to the clicked link */
  clickedElement.classList.add('active')
  //console.log('clicked element: ', this)

  /* [DONE] remove class 'active' from all articles */
  const activeArticles = document.querySelectorAll('article.active')

  for (let activeArticle of activeArticles) {
    activeArticle.classList.remove('active')
  }

  /* [DONE] get 'href' attribute from the clicked link */
  const attribute = clickedElement.getAttribute('href')
  //console.log(attribute)

  /* [DONE] find the correct article using the selector (value of 'href' attribute) */
  const correctArticle = document.querySelector(attribute)

  /* [DONE] add class 'active' to the correct article */
  correctArticle.classList.add('active')
}

//////////////////////

const optCloudClassCount = 5,
  optCloudClassPrefix = 'tag-size-'

const optArticleSelector = '.post',
  optTitleSelector = '.post-title',
  optTitleListSelector = '.titles',
  optArticleTagsSelector = '.post-tags .list',
  optTagsListSelector = '.list.tags',
  optAuthorsListSelector = '.list.authors'

function generateTitleLinks(customSelector = '') {
  //console.log(customSelector)
  //console.log(optArticleSelector + customSelector)
  /* remove contents of titleList */
  const titleList = document.querySelector(optTitleListSelector)
  titleList.innerHTML = ''
  /* for each article */
  const articles = document.querySelectorAll(
    optArticleSelector + customSelector
  )

  let html = ''
  for (let article of articles) {
    /* get the article id */
    const articleId = article.getAttribute('id')
    /* find the title element */
    /* get the title from the title element */
    const articleTitle = article.querySelector(optTitleSelector).innerHTML

    /* create HTML of the link */
    const linkHTMLData = { id: articleId, title: articleTitle }
    const linkHTML = templates.articleLink(linkHTMLData)
    //console.log(linkHTML)
    /* insert link into titleList */
    html += linkHTML
  }
  titleList.innerHTML = html

  const links = document.querySelectorAll('.titles a')

  for (let link of links) {
    link.addEventListener('click', titleClickHandler)
  }
}

generateTitleLinks()

//////////////////////

function calculateTagsParams(tags) {
  let params = {
    max: 0,
    min: 1000,
  }
  for (let tag in tags) {
    params.min = params.min > tags[tag] ? tags[tag] : params.min
    params.max = tags[tag] > params.max ? tags[tag] : params.max
  }

  return params
}

function generateTags() {
  /* [NEW] create a new variable allTags with an empty object */
  let allTags = {}
  /* find all articles */
  const articles = document.querySelectorAll(optArticleSelector)
  /* START LOOP: for every article: */
  for (let article of articles) {
    //console.log(article)
    /* find tags wrapper */
    const articleId = article.getAttribute('id')
    //console.log(articleId)
    const tagWrapper = article.querySelector(optArticleTagsSelector)
    //console.log(tagWrapper)
    /* make html variable with empty string */
    let html = ''
    /* get tags from data-tags attribute */
    const tags = article.getAttribute('data-tags')

    /* split tags into array */
    const tagsArr = tags.split(' ')
    //console.log(tagsArr)
    /* START LOOP: for each tag */
    for (let tag of tagsArr) {
      /* generate HTML of the link */
      const linkHTMLData = { tag: tag }
      const linkHTML = templates.tagLink(linkHTMLData)
      /* add generated code to html variable */
      html += linkHTML
      /* [NEW] check if this link is NOT already in allTags */
      if (!allTags[tag]) {
        /* [NEW] add tag to allTags object */
        allTags[tag] = 1
      } else {
        allTags[tag]++
      }
      /* END LOOP: for each tag */
    }
    tagWrapper.innerHTML = html
    /* insert HTML of all the links into the tags wrapper */
    /* END LOOP: for every article: */
    /* [NEW] find list of tags in right column */
    const tagList = document.querySelector(optTagsListSelector)
    //console.log(tagList)
    const tagsParams = calculateTagsParams(allTags)
    //console.log('tag params: ', tagsParams)
    /* [NEW] create variable for all links HTML code */
    const allTagsData = { tags: [] }

    /* [NEW] START LOOP: for each tag in allTags: */
    for (let tag in allTags) {
      allTagsData.tags.push({
        tag: tag,
        count: allTags[tag],
        className: calculateTagClass(allTags[tag], tagsParams),
      })
    }
    /* [NEW] END LOOP: for each tag in allTags: */

    /*[NEW] add HTML from allTagsHTML to tagList */
    tagList.innerHTML = templates.tagCloudLink(allTagsData)
    //console.log(allTagsData)
  }
}

generateTags()

function tagClickHandler(e) {
  /* prevent default action for this event */
  e.preventDefault()
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href')
  /* make a new constant "tag" and extract tag from the "href" constant */
  const tag = href.replace('#tag-', '')
  //console.log(tag)
  /* find all tag links with class active */
  const activeLinks = document.querySelectorAll('a.active[href^="#tag-"]')
  /* START LOOP: for each active tag link */
  for (let activeLink of activeLinks) {
    /* remove class active */
    activeLink.classList.remove('active')
    /* END LOOP: for each active tag link */
  }
  /* find all tag links with "href" attribute equal to the "href" constant */
  const hrefLinks = document.querySelectorAll('a[href="' + href + '"]')
  //console.log(hrefLinks)
  /* START LOOP: for each found tag link */
  for (let hrefLink of hrefLinks) {
    /* add class active */
    hrefLink.classList.add('active')
    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-tags~="' + tag + '"]')
}

function addClickListenersToTags() {
  /* find all links to tags */
  const links = document.querySelectorAll('a[href^="#tag-"]')
  //console.log(links)
  /* START LOOP: for each link */
  for (let link of links) {
    /* add tagClickHandler as event listener for that link */
    link.addEventListener('click', tagClickHandler)
    /* END LOOP: for each link */
  }
}

addClickListenersToTags()

//////////////////////

const optArticleAuthorSelector = '.post-author'

function generateAuthors() {
  let allAuthors = {}
  const articles = document.querySelectorAll(optArticleSelector)
  for (let article of articles) {
    const author = article.getAttribute('data-author')
    if (!allAuthors[author]) {
      allAuthors[author] = 1
    } else {
      allAuthors[author]++
    }
    //console.log(author)
    const authorWrapper = article.querySelector(optArticleAuthorSelector)

    const linkHTMLData = { author }
    const linkHTML = templates.authorLink(linkHTMLData)
    authorWrapper.innerHTML = linkHTML
    //console.log(authorWrapper.innerHTML)

    const authorList = document.querySelector(optAuthorsListSelector)
    //console.log(authorList)
    const authorParams = calculateTagsParams(allAuthors)

    const allAuthorsData = { authors: [] }

    for (let author in allAuthors) {
      allAuthorsData.authors.push({
        author,
        count: allAuthors[author],
        className: calculateTagClass(allAuthors[author], authorParams),
      })
    }
    authorList.innerHTML = templates.authorCloudLink(allAuthorsData)
    console.log(allAuthorsData)
  }
}

generateAuthors()

function addClickListenersToAuthors() {
  const links = document.querySelectorAll('a[href^="#author-"]')

  //console.log(links)
  for (let link of links) {
    link.addEventListener('click', authorClickHandler)
  }
}

addClickListenersToAuthors()

function authorClickHandler(e) {
  /* prevent default action for this event */
  e.preventDefault()
  /* make new constant named "clickedElement" and give it the value of "this" */
  const clickedElement = this
  /* make a new constant "href" and read the attribute "href" of the clicked element */
  const href = clickedElement.getAttribute('href')
  /* make a new constant "author" and extract author from the "href" constant */
  const author = href.replace('#author-', '')
  //console.log(author)
  /* find all author links with class active */
  const activeLinks = document.querySelectorAll('a.active[href^="#author-"]')
  //console.log(activeLinks)
  /* START LOOP: for each active tag link */
  for (let activeLink of activeLinks) {
    /* remove class active */
    activeLink.classList.remove('active')
    /* END LOOP: for each active tag link */
  }
  /* find all authors links with "href" attribute equal to the "href" constant */
  const hrefLinks = document.querySelectorAll('a[href="' + href + '"]')
  //console.log(hrefLinks)
  /* START LOOP: for each found tag link */
  for (let hrefLink of hrefLinks) {
    /* add class active */
    hrefLink.classList.add('active')
    /* END LOOP: for each found tag link */
  }
  /* execute function "generateTitleLinks" with article selector as argument */
  generateTitleLinks('[data-author="' + author + '"]')
}

function calculateTagClass(count, params) {
  const normalizedCount = count - params.min
  const normalizedMax = params.max - params.min
  const percentage = normalizedCount / normalizedMax

  const classNumber = Math.floor(percentage * (optCloudClassCount - 1) + 1)

  return `${optCloudClassPrefix}${classNumber}`
}
