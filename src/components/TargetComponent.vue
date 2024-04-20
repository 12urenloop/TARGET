<template>
  <RunningTrackComponent
    v-if="mounted && !frozen"
    :points="points"
    :teams="teams"
    :img="img"
    :showPoints="showPoints"
    :showTrack="showTrack"
    :frozen="frozen"
  />
  <MessageComponent :message="message" />
  <LeaderboardComponent :teams="teams" :frozen="frozen" class="mt-3 mb-3" />
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import RunningTrackComponent from '@/components/RunningTrackComponent.vue';
import LeaderboardComponent from '@/components/LeaderboardComponent.vue';
import { type Count, type Position, type SocketMsg, socketMsgHandler } from '@/assets/loxsi';
import MessageComponent from '@/components/MessageComponent.vue';
import type { Team } from '@/assets/team';

export default defineComponent({
  name: 'TargetComponent',
  components: { MessageComponent, LeaderboardComponent, RunningTrackComponent },
  props: [
    'configuration',
  ],
  data() {
    return {
      showPoints: false,
      showTrack: false,
      mounted: false,
      img: '',
      points: [
        { x: 0, y: 0 },
      ],
      wsEndpoint: '',
      message: '',
      teams: [] as Team[],
      frozen: false,
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
      this.wsEndpoint = config.wsEndpoint;
      this.showPoints = config.showPoints;
      this.showTrack = config.showTrack;
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
          case 'frozen':
            this.handleNewFrozen(result);
            break;
          default:
            console.error(`ERROR: unknown websocket message topic: ${socketMsg.topic}`);
        }
      } catch (err) {
        console.error(`ERROR: could not parse websocket message\nMessage: ${msg}\nReason: ${err}`);
      }
    },
    handleNewCounts(counts: Count[]) {
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
            speed: 0,
            acceleration: 0,
            timestamp: new Date().getTime(),
            show: true,
          });
        }
      }
    },
    handleNewPosition(positions: Position[]) {
      for (const position of positions) {
        const team = this.teams.find((team) => team.team_id === position.team_id);
        if (team) {
          team.progress = position.progress;
          team.speed = position.speed;
          team.acceleration = position.acceleration || 0;
          team.timestamp = position.timestamp;
        } else {
          console.error(`ERROR: could not find team with id ${position.team_id} while processing position message`);
        }
      }
    },
    handleNewMessage(message: string) {
      this.message = message;
    },
    handleNewFrozen(frozen: boolean) {
      this.frozen = frozen;
    },
  },
});
</script>


<style scoped>
</style>
