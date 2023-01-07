<template>
  <div id="popupNetworkError" class="d-flex justify-content-center align-items-center">
    <div id="popup">
      <div class="d-flex justify-content-center">
        <h2>No internet connection</h2>
      </div >
    </div>
  </div>
</template>

<script>

export default {
  name: 'NetworkError',

};
</script>

<style>


.chooser > button {
  margin: 20px;
}

.chooser > button > .icon {
  font-size: 100px;
}

#popupNetworkError{
  background: rgb(255, 0, 0, 0.3);
  z-index: 150;
  position: absolute;
  width: 100%;
  height: 100%;
}

@keyframes fadein {
  from { opacity: 0}
  to   { opacity: 1}
}
</style>

