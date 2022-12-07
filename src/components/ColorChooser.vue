<template>
  <div class="d-flex flex-column min-vh-100 justify-content-center align-items-center popup" id="popupColorChooser">
    <div>
      <h2 style="color: white">Choose a color</h2>
    </div>
    <div class="chooser">
      <button id="btnWhiteColorChooser" class="btn btn-light">
        <p class="icon">♔</p>
        <p>WHITE</p>
      </button>
      <button id="btnBlackColorChooser" class="btn btn-light">
        <p class="icon">♚</p>
        <p>BLACK</p>
      </button>
    </div>

  </div>
</template>

<script>
export default {
  name: "ColorChooser"
}
</script>

<style scoped>

</style>