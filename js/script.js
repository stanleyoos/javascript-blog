// document.getElementById('my-button').addEventListener('click', () => {
//   const links = document.querySelectorAll('.titles a')
//   console.log(links)
// })

//
'use strict'

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

const links = document.querySelectorAll('.titles a')

for (let link of links) {
  link.addEventListener('click', titleClickHandler)
}
