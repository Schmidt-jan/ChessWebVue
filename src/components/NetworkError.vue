<template>
  <div id="popupNetworkError" class="d-flex justify-content-center align-items-center">
    <div id="popupError">
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

#popupError {
  background: rgba(255, 0, 0, 0.76);
  border-radius: 10px;
  padding: 50px;
  opacity: 0;
  animation-delay: 0.2s;
  animation-name: fadein;
  animation-duration: 0.7s;
  animation-fill-mode: forwards;
  color: white;
}

@keyframes fadein {
  from { opacity: 0}
  to   { opacity: 1}
}
</style>

