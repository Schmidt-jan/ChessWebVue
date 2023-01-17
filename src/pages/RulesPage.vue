<template>
  <div class="d-flex" id="wrapper">
    <div class="border-end bg-white" id="sidebar-wrapper">
      <div class="sidebar-heading border-bottom bg-light">Start Bootstrap</div>
      <div class="list-group list-group-flush">
        <a class="list-group-item list-group-item-action list-group-item-light p-3" href="#King">King</a>
        <a class="list-group-item list-group-item-action list-group-item-light p-3" href="#Queen">Queen</a>
        <a class="list-group-item list-group-item-action list-group-item-light p-3" href="#Rook">Rook</a>
        <a class="list-group-item list-group-item-action list-group-item-light p-3" href="#Bishop">Bishop</a>
        <a class="list-group-item list-group-item-action list-group-item-light p-3" href="#Knight">Knight</a>
        <a class="list-group-item list-group-item-action list-group-item-light p-3" href="#Pawn">Pawns</a>
      </div>
    </div>
    <div id="page-content-wrapper">
      <div data-spy="scroll" data-target="#RulesNav" data-offset="0">

        <img id="King" class="w-25 img_center"
             src="https://upload.wikimedia.org/wikipedia/commons/4/42/Chess_klt45.svg"/>
        <h4 class="text-center">King</h4>
        <p class="text-center">The king (♔, ♚) is the most important piece in the game of chess. It may move to any adjoining square; it may
          also perform a move known as castling. If a player's king is threatened with capture, it is said to be in
          check, and the player must remove the threat of capture on the next move. If this cannot be done, the king is
          said to be in checkmate, resulting in a loss for that player. A player cannot make any move that places their
          own king in check. Despite this, the king can become a strong offensive piece in the endgame or, rarely, the
          middlegame.
          In algebraic notation, the king is abbreviated by the letter K among English speakers. The white king starts
          the game on e1; the black king starts on e8. Unlike the other pieces, only one king per player can be on the
          board at any time, and the kings are never removed from the board during the game. </p>


        <img id="Queen" class="w-25 img_center"
             src="https://upload.wikimedia.org/wikipedia/commons/1/15/Chess_qlt45.svg"/>
        <h4 class="text-center">Queen</h4>
        <p class="text-center">The queen (♕, ♛) is the most powerful piece in the game of chess, able to move any number of squares
          vertically, horizontally or diagonally, combining the power of the rook and bishop. Each player starts the
          game with one queen, placed in the middle of the first rank next to the king. Because the queen is the
          strongest piece, a pawn is promoted to a queen in the vast majority of cases.
          The predecessor to the queen is the ferz, a weak piece only able to move or capture one step diagonally,
          originating from the Persian game of shatranj. The modern queen gained its power and its modern move in Spain
          in the 15th century during Isabella I's reign, perhaps inspired by her great political power. </p>


        <img id="Rook" class="w-25 img_center"
             src="https://upload.wikimedia.org/wikipedia/commons/7/72/Chess_rlt45.svg"/>
        <h4 class="text-center">Rook</h4>
        <p class="text-center">The rook (/rʊk/; ♖, ♜) is a piece in the game of chess. It may move any number of squares horizontally or
          vertically without jumping, and it may capture an enemy piece on its path; additionally, it may participate in
          castling. Each player starts the game with two rooks, one in each corner on their own side of the board.
          Formerly, the rook (from Persian رخ rokh/rukh, meaning "chariot") was alternatively called the tower,
          marquess, rector, and comes (count or earl).[1] The term "castle" is considered to be informal, incorrect, or
          old-fashioned.</p>


        <img id="Bishop" class="w-25 img_center"
             src="https://upload.wikimedia.org/wikipedia/commons/b/b1/Chess_blt45.svg"/>
        <h4 class="text-center">Bishop</h4>
        <p class="text-center">The bishop (♗, ♝) is a piece in the game of chess. It moves and captures along diagonals without jumping over
          intervening pieces. Each player begins the game with two bishops. One starts between the king's knight and the
          king, the other between the queen's knight and the queen. The starting squares are c1 and f1 for White's
          bishops, and c8 and f8 for Black's bishops. </p>


        <img id="Knight" class="w-25 img_center"
             src="https://upload.wikimedia.org/wikipedia/commons/7/70/Chess_nlt45.svg"/>
        <h4 class="text-center">Knight</h4>
        <p class="text-center">The knight (♘, ♞) is a piece in the game of chess, represented by a horse's head and neck. It may move two
          squares vertically and one square horizontally or two squares horizontally and one square vertically, jumping
          over other pieces. Each player starts the game with two knights on the b- and g-files, each located between a
          rook and a bishop.</p>


        <img id="Pawn" class="w-25 img_center"
             src="https://upload.wikimedia.org/wikipedia/commons/4/45/Chess_plt45.svg"/>
        <h4 class="text-center">Pawn</h4>
        <p class="text-center">The pawn (♙, ♟) is the most numerous and weakest piece in the game of chess. It may move one vacant square
          directly forward, it may move two vacant squares directly forward on its first move, and it may capture one
          square diagonally forward. Each player begins a game with eight pawns, one on each square of their second
          rank. The white pawns start on a2 through h2; the black pawns start on a7 through h7.
          Individual pawns are referred to by the file on which they stand. For example, one speaks of "White's f-pawn"
          or "Black's b-pawn". Alternatively, they can be referred to by the piece which stood on that file at the
          beginning of the game, e.g. "White's king bishop's pawn" or "Black's queen knight's pawn". It is also common
          to refer to a rook's pawn, meaning any pawn on the a- or h-files, a knight's pawn (on the b- or g-files), a
          bishop's pawn (on the c- or f-files), a queen's pawn (on the d-file), a king's pawn (on the e-file), and a
          central pawn (on the d- or e-files).
          The pawn historically represents soldiers or infantry, or more particularly, armed peasants or pikemen.</p>

      </div>
    </div>


  </div>
</template>

<script>
import {defineComponent} from "vue";
import {useToast} from "vue-toastification";

export default defineComponent({
  name: "RulesPage",
  mounted() {
    const toast = useToast();
    toast.clear()
  }
});
</script>

<style>
#wrapper {
  overflow-x: hidden;
}

#sidebar-wrapper {
  min-height: 100vh;
  margin-left: -15rem;
  -webkit-transition: margin .25s ease-out;
  -moz-transition: margin .25s ease-out;
  -o-transition: margin .25s ease-out;
  transition: margin .25s ease-out;
}

#sidebar-wrapper .sidebar-heading {
  padding: 0.875rem 1.25rem;
  font-size: 1.2rem;
}

#sidebar-wrapper .list-group {
  width: 15rem;
}

#page-content-wrapper {
  min-width: 100vw;
  margin: 30px;
}


body.sb-sidenav-toggled #wrapper #sidebar-wrapper {
  margin-left: 0;
}

@media (min-width: 768px) {
  #sidebar-wrapper {
    margin-left: 0;
  }

  #page-content-wrapper {
    min-width: 0;
    width: 100%;
  }

  body.sb-sidenav-toggled #wrapper #sidebar-wrapper {
    margin-left: -15rem;


  }
}
.img_center {
  margin: auto;
  display: block;
}
</style>