// "useAffect" this function to allow cards to have the anchor tag surround only the title 
// and yet allow whole card to act as single click or tab target.
// Based on https://inclusive-components.design/cards/
export function TopicCardAccessible() {
    // console.log('useEffect mount');
    const clickableCards = document.querySelectorAll('.topicCard'); 

    if (clickableCards.length) {
      // console.log('CC module engaging, CCs found');
      // console.log(clickableCards);

      Array.prototype.forEach.call(clickableCards, (card) => {
        let downTime,
          upTime,
          downTarget,
          upTarget,
          link = card.querySelector('a.topic-card');

        const extraLinksInCard = card.querySelectorAll('a:not(.topic-card)');
        // console.log(extraLinksInCard);

        Array.prototype.forEach.call(extraLinksInCard, (extraLink) => {
          extraLink.classList.add('card-extra-link');
          extraLink.addEventListener('click', (e) => {
            // e.preventDefault(); // this line prevents changing to the URL of the link href
            e.stopPropagation(); // this line prevents the link click from bubbling
            // console.log("child clicked");
          });
        });

        card.style.cursor = 'pointer';

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
            if (!upTarget.matches('.topic-card') && !upTarget.matches('.card-extra-link')) {
              // If the mouse target is inside the card but not part of the actual topic-card elament, we'll need to simulate clicking the link
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
