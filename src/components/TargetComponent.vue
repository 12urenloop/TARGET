<template>
  <RunningTrackComponent
    v-if="mounted"
    :points="points"
    :colors="colors"
    :teams="teams"
    :img="img"
  />
  <LeaderboardComponent :teams="teams" class="mt-3 mb-3" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RunningTrackComponent from '@/components/RunningTrackComponent.vue';
import LeaderboardComponent from '@/components/LeaderboardComponent.vue';
import { type Count, type Position, type SocketMsg, socketMsgHandler } from '@/assets/loxsi';

export default defineComponent({
  name: 'TargetComponent',
  components: { LeaderboardComponent, RunningTrackComponent },
  props: [
    'configuration',
  ],
  data() {
    return {
      showPoints: false,
      mounted: false,
      img: '',
      points: [
        { x: 0, y: 0 },
      ],
      colors: {} as any,
      wsEndpoint: '',
      teams: [
        {
          team_id: 1,
          team_name: 'VTK',
          rounds: 2,
          progress: 0.5,
          speed: 0.02,
          timestamp: new Date().getTime(),
          show: true,
        },
        {
          team_id: 2,
          team_name: 'VGK',
          rounds: 3,
          progress: 0.7,
          speed: 0.05,
          timestamp: new Date().getTime(),
          show: true,
        },
        {
          team_id: 3,
          team_name: 'Wetenschappen',
          rounds: 2,
          progress: 0.3,
          speed: 0.03,
          timestamp: new Date().getTime(),
          show: true,
        },
      ],
    };
  },
  async mounted() {
    await this.loadConfiguration();
    this.mounted = true;
    await this.connectWebSocket();
  },
  methods: {
    async loadConfiguration() {
      // Load the JSON configuration file and update the component's data
      const config = await import(`./../configurations/${this.configuration}.json`);
      console.log(config);
      this.img = config.img;
      this.points = config.points;
      this.colors = config.colors;
      this.wsEndpoint = config.wsEndpoint;
    },
    async connectWebSocket(timeout = 0) {
      timeout = Math.min(timeout, 5000);
      if (timeout > 0) {
        console.log(`Opening websocket with ${timeout / 1000}s timeout`);
        await new Promise((res) => setTimeout(res, timeout));
      }

      // Connect to the WebSocket server
      const ws = new WebSocket(this.wsEndpoint);
      ws.onerror = async (err) => {
        console.error(`WEBSOCKET ERROR:`, err);
      };
      ws.onclose = async (ev) => {
        console.error(`WEBSOCKET CLOSED:`, ev);
        await this.connectWebSocket(timeout + 1000);
      };
      ws.onmessage = (event) => {
        console.log(event.data);
        this.parseWebsocketMessage(event.data);
      };
    },
    parseWebsocketMessage(msg: string) {
      try {
        let socketMsg: SocketMsg = JSON.parse(msg);
        if (!socketMsgHandler[socketMsg.topic]) {
          return;
        }
        const result = socketMsgHandler[socketMsg.topic](socketMsg);
        switch (socketMsg.topic) {
          case 'counts':
            this.handleNewCounts(result);
            break;
          case 'position':
            this.handleNewPosition(result);
            break;
          case 'message':
            this.handleNewMessage(result);
            break;
          default:
            console.error(`ERROR: unknown websocket message topic: ${socketMsg.topic}`);
        }
      } catch (err) {
        console.error(`ERROR: could not parse websocket message\nMessage: ${msg}\nReason: ${err}`);
      }
    },
    handleNewCounts(counts: Count[]) {
      console.log(counts);
      for (const count of counts) {
        const team = this.teams.find((team) => team.team_id === count.team.id);
        if (team) {
          team.rounds = count.count;
        } else {
          this.teams.push({
            team_id: count.team.id,
            team_name: count.team.name,
            rounds: count.count,
            progress: 0,
            speed: Math.random() / 30,  // TODO: set to some default value
            timestamp: new Date().getTime(),
            show: true,
          });
        }
      }
    },
    handleNewPosition(positions: Position[]) {
      console.log(positions);
      for (const position of positions) {
        const team = this.teams.find((team) => team.team_id === position.team_id);
        if (team) {
          team.progress = position.progress;
          team.speed = position.speed;
          team.timestamp = new Date().getTime();
        } else {
          console.error(`ERROR: could not find team with id ${position.team_id} while processing position message`);
        }
      }
    },
    handleNewMessage(message: string) {
      console.log(message);
      console.error('message not implemented yet');
    },
  },
});
</script>


<style scoped>
</style>
