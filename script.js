
const cancelButtonQuery = '[data-testid="confirmationSheetCancel"]';
const confirmButtonQuery = '[data-testid="confirmationSheetConfirm"]';
const userNameDeepLevel = 4;
const followsYouDeepLevel = 4;
const tag = 'span';
let primaryScrollHeight = document.body.scrollHeight;
let endScrollHeight = 0;
let array = [];
let secondStart = 30;
let secondEnd = 300
function randomGen() {
  let random = Math.floor((Math.random() * secondEnd) + secondStart);
  console.log('delay ==>', random);
  return random;
}

const unFollowLooper = async _ => {
  console.log('Start')
  for (let i = 0; i < array.length; i++) {
    console.log(`Total in page : ${array.length}, Current one: ${i}`)
    //await sleep({ seconds: randomGen() });
    await sleep({ seconds: 5 });
    try {
      array[i].click();
      //waits 3 seconds to click 
      await sleep({ seconds: 3 });
      const actionButton = document.querySelector(confirmButtonQuery);
      actionButton.click();
    } catch (error) {
      console.log('skip')
    }
  }
  console.log('End');
  // lets start the next batch
  primaryScrollHeight = document.body.scrollHeight;
  console.log('Setting to primary ===', primaryScrollHeight)
  await sleep({ seconds: 3 });
  window.scrollTo(0, document.body.scrollHeight);
  await sleep({ seconds: 3 });
  // update current height to endScrollHeight
  endScrollHeight = document.body.scrollHeight;
  console.log('Setting to endscroll ===', endScrollHeight)

  console.log(`Primary scroll is ${primaryScrollHeight}, EndScroll  ${endScrollHeight}`);
  if (primaryScrollHeight < endScrollHeight) {
    // running scroller and adding next batch
    primaryScrollHeight = document.body.scrollHeight;
    await sleep({ seconds: 2 });
    array = [];
    console.log('Running next batch');
    filterWithWord("Following");
  } else {
    console.log('End reached nothing to unfollow');
    array = [];
    filterWithWord("Following");
  }

}

function filterWithWord(word) {
  res = []
  elems = [...document.getElementsByTagName(tag)];
  elems.forEach((elem) => {
    if (elem.innerHTML.includes(word)) {
      // first level deep look 
      let tempElem = elem;
      for (let du = 1; du <= userNameDeepLevel; du++) {
        tempElem = tempElem.parentElement;
        if (du === userNameDeepLevel) {
          // this is final deep look from here we will start the next check
          if (tempElem.innerText.includes('@') && !tempElem.innerText.includes('Follows you')) {
            // this means, we fileted now only real users 
            // now check whether they follow us back or not 
            // the below block starting from stating 'starts here' to stating 'ends here'
            // should be uncommented if the deep levels are same for username and follows you
            // and also should change the above if as follows
            // @101 if (tempElem.includes('@')) {   instead of if (tempElem.includes('@') && !tempElem.includes('Follows you')) {
            res.push(elem); // this should be commented of the if consition above this is changed as stated on @101


            // stating 'starts here'
            // tempElem = elem;
            // for (let df = 1; df <= followsYouDeepLevel; df++) {
            //   if (du === followsYouDeepLevel) {
            //     if (!tempElem.includes('Follows you')) {
            //       res.push(elem);
            //     }
            //   }
            // }
            //stating 'end here'
          } else {
            console.log('Running scroller')
           // window.scrollTo(0, document.body.scrollHeight);
          }
        }
      }
    }
  })
  array = res;
  if (array.length) {
    unFollowLooper();
  } else {
    console.log('End')
  }
}

const sleep = ({ seconds }) =>
  new Promise(proceed => {
    console.log(`WAITING FOR ${seconds} SECONDS...`);
    setTimeout(proceed, seconds * 1000);
  });

filterWithWord("Following");
