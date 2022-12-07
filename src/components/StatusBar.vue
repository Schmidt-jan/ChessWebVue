<template>
  <div class="col-md-6">
    <div class="custPadding_r" >
      <div class="rightPanelFrame">
        <div class="row">
          <h2>State</h2>
          <p>
            State:
            <b id="labelState" class="highlight_color"></b>
          </p>
          <p>Current Player:
            <b id="labelPlayer" class="highlight_color"></b>
          </p>
          <p>
        </div>
      </div>
      <div style="background-color: transparent;
                            height: 10px;
                        "></div>
      <div class="rightPanelFrame">
        <div class="row">
          <h2>Settings</h2>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="toggleSound" checked>
            <label class="form-check-label" for="flexSwitchCheckDefault">Sound</label>
          </div>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="toggleHints" checked>
            <label class="form-check-label" for="flexSwitchCheckDefault">
              Hints for possible moves</label>
          </div>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="toggleAutoRotate" >
            <label class="form-check-label" for="flexSwitchCheckDefault">Auto rotation</label>
          </div>
          <div class="form-check form-switch">
            <input class="form-check-input" type="checkbox" id="toggle3d" checked>
            <label class="form-check-label" for="flexSwitchCheckDefault">Cooler look?</label>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
export default {
  name: "StatusBar.vue"
}
</script>

<style scoped>

</style>