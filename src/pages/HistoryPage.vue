<template>
  <div class="container conHeight">
    <div class="row">
      <div class="col">
        <div data-spy="scroll" data-target="#RulesNav" data-offset="0">
          <h4 id="History">History</h4>
          <p>Chess is a board game for two players. It is sometimes called Western chess or international chess to
            distinguish it from related games, such as xiangqi (Chinese chess) and shogi (Japanese chess). The current
            form of the game emerged in Spain and the rest of Southern Europe during the second half of the 15th century
            after evolving from chaturanga, a similar but much older game of Indian origin. Today, chess is one of the
            world's most popular games, played by millions of people worldwide.

            Chess is an abstract strategy game and involves no hidden information. It is played on a chessboard with 64
            squares arranged in an eight-by-eight grid. At the start, each player controls sixteen pieces: one king, one
            queen, two rooks, two bishops, two knights, and eight pawns. The player who moves first controls white
            pieces, and the other controls black pieces. The object of the game is to checkmate the opponent's king,
            whereby the king is under immediate attack (in "check") and there is no way for it to escape. There are also
            several ways a game can end in a draw.

            Organized chess arose in the 19th century. Chess competition today is governed internationally by FIDE
            (International Chess Federation). The first universally recognized World Chess Champion, Wilhelm Steinitz,
            claimed his title in 1886; Magnus Carlsen is the current World Champion. A huge body of chess theory has
            developed since the game's inception. Aspects of art are found in chess composition, and chess in its turn
            influenced Western culture and art, and has connections with other fields such as mathematics, computer
            science, and psychology.

            One of the goals of early computer scientists was to create a chess-playing machine. In 1997, Deep Blue
            became the first computer to beat the reigning World Champion in a match when it defeated Garry Kasparov.
            Today's chess engines are significantly stronger than the best human players and have deeply influenced the
            development of chess theory. </p>
          <div class="w-100 ratio ratio-21x9">
            <iframe src="https://www.youtube.com/embed/YeB-1F-UKO0" title="A brief history of chess - Alex Gendler"
                    allowfullscreen></iframe>
          </div>

        </div>
      </div>
    </div>
  </div>
</template>

<script>
import {defineComponent} from "vue";
import {useToast} from "vue-toastification";

export default defineComponent({
  name: 'HistoryPage',
  mounted() {
    const toast = useToast();
    toast.clear()
  }
})
</script>

<style>

.conHeight {
  padding-top: 100px;
}
</style>