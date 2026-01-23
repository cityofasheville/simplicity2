// Drop this function in an on-mount useEffect to allow cards containing a link to be clickable as a whole
// The whole card acts as single click or focus target
// Additional links inside the card are preserved and clickable / focusable
// Based on https://inclusive-components.design/cards/

export function TopicCardAccessible() {
  // console.log('useEffect mount');
  const clickableCards = document.querySelectorAll('.card-clickable'); // Outer class of whole card

  if (clickableCards.length) {
    // console.log('CC module engaging, CCs found');
    // console.log(clickableCards);

    Array.prototype.forEach.call(clickableCards, (card) => {
      let downTime,
        upTime,
        downTarget,
        upTarget,
        link = card.querySelector('a.card-link-action'); // Effective link for the card as a whole (should be title)

      // Use this code if your cards have additional links
      const extraLinksInCard = card.querySelectorAll('a:not(.card-link-action)');
      // console.log(extraLinksInCard);

      Array.prototype.forEach.call(extraLinksInCard, (extraLink) => {
        extraLink.classList.add('card-extra-link');
        extraLink.addEventListener('click', (e) => {
          // e.preventDefault(); // this line prevents changing to the URL of the link href
          e.stopPropagation(); // this line prevents the link click from bubbling
          // console.log("child clicked");
        });
      });

      // card.style.cursor = 'pointer';

      card.onmousedown = (e) => {
        downTarget = e.target;
        // console.log('MOUSE DOWN TARGET: ', downTarget);
        downTime = +new Date();
        // console.log('MouseDown');
      };

      card.onmouseup = (e) => {
        upTarget = e.target;
        // console.log("MOUSE UP TARGET: ", upTarget);
        upTime = +new Date();
        // console.log("Diff: ", +(upTime - downTime));
        e.preventDefault();

        if (upTarget === downTarget && e.button === 0) {
          if (!upTarget.matches('.card-link-action') && !upTarget.matches('.card-extra-link')) {
            // If the mouse target is inside the card but not directly on an actual link element, we'll need to simulate clicking the .card-link-action link
            if (upTime - downTime < 300) {
              link.click();
              // console.log("SIMULATE CLICK!");
            }
          }
          // console.log('targets match! Link clicked!');
        }
      };
    });
  }
}
