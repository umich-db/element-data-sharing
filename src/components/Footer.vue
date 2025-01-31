<template>
  <div class="container">
    <a class="image-size" href="https://www.umich.edu" target="_blank" rel="noopener noreferrer">
      <img src="../assets/michigan_logo.png" alt="Michigan Logo" />
    </a>

    <div class="right-content">
      <div class="content">
        <div class="content-item" style="font-weight: bold;">
          School of Public Health <span style="color: yellow;">&nbsp;|&nbsp;</span> 734-764-5425
        </div>
        <div class="content-item">
          1415 Washington Heights, Ann Arbor, MI 48109-2029
        </div>
        <div>&nbsp;</div>
        <div class="content-item">
          <span style="color: yellow;">&#169;&nbsp;</span> 2024 The Regents of the University of Michigan
          <span style="color: yellow;">&nbsp;|&nbsp;</span>
          <a href="https://giving.umich.edu/um/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>
          <span style="color: yellow;">&nbsp;|&nbsp;</span>
          <a href="https://sph.umich.edu/diversity-equity-inclusion/" target="_blank" rel="noopener noreferrer">Diversity, Equity, and Inclusion</a>
          <span style="color: yellow;">&nbsp;|&nbsp;</span>
          <a href="https://www.dpss.umich.edu/" target="_blank" rel="noopener noreferrer">Campus Safety</a>
          <span style="color: yellow;">&nbsp;|&nbsp;</span>
          <a href="https://www.umich.edu" target="_blank" rel="noopener noreferrer">U-M HOME</a>
        </div>
      </div>
      <div class="extra-images">
          <img src="../assets/Element_Logo.jpg" alt="Placeholder 1" />
          <img src="../assets/unnamed.png" alt="Placeholder 2" />
      </div>
    </div>
  </div>
</template>

<style scoped>
.container {
  display: grid;
  grid-template-columns: 1fr 4fr;
  align-items: center;
  background-color: #00274c;
  padding: 1rem 2rem;
}

.image-size {
  width: 25%;
}

.right-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
}

.content {
  color: white;
  display: flex;
  flex-direction: column;
}

.content-item {
  display: flex;
  justify-content: start;
}

.content-item a {
  color: white;
  text-decoration: none;
}

.content-item a:hover {
  text-decoration: underline;
}

.extra-images {
  display: flex;
  gap: 1rem; 
}

.extra-images img {
  width: 100px;
  height: auto;
  border-radius: 8px;
}
</style>
