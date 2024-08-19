document.addEventListener('DOMContentLoaded', () => {
    let currentIndex = 0;
    let showingFront = true;
  
    const flashcardContainer = document.getElementById('flashcard-container');
    const prevBtn = document.getElementById('prev-btn');
    const flipBtn = document.getElementById('flip-btn');
    const nextBtn = document.getElementById('next-btn');
  
    function displayFlashcard() {
      const flashcard = flashcardsData[currentIndex];
      flashcardContainer.innerHTML = `
        <div class="flashcard">
          <div class="flashcard-content">
            ${showingFront ? flashcard.front : flashcard.back}
          </div>
        </div>
      `;
    }
  
    function flipCard() {
      showingFront = !showingFront;
      displayFlashcard();
    }
  
    function nextCard() {
      currentIndex = (currentIndex + 1) % flashcardsData.length;
      showingFront = true;
      displayFlashcard();
    }
  
    function prevCard() {
      currentIndex = (currentIndex - 1 + flashcardsData.length) % flashcardsData.length;
      showingFront = true;
      displayFlashcard();
    }
  
    prevBtn.addEventListener('click', prevCard);
    flipBtn.addEventListener('click', flipCard);
    nextBtn.addEventListener('click', nextCard);
  
    // Initial display
    if (flashcardsData.length > 0) {
      displayFlashcard();
    } else {
      flashcardContainer.innerHTML = '<p>No flashcards available. Create some first!</p>';
    }
  });