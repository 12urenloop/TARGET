<template>
  <main>
    <component :is="currentView"
               :points="points"
               :message="message"
               :teams="teams"
               :img="img"
               :showPoints="showPoints"
               :showTrack="showTrack"
               :frozen="frozen"
    />
  </main>
</template>

<script lang="ts">
import { defineComponent } from 'vue';
import TargetComponent from '@/components/TargetComponent.vue';
import LedWallComponent from '@/components/LedWallComponent.vue';
import { type Count, type Position, type SocketMsg, socketMsgHandler } from '@/assets/loxsi';
import type { Team } from '@/assets/team';
import RunningTrackComponent from '@/components/RunningTrackComponent.vue';

const routes = {
  '/': TargetComponent,
  '/ledwall': LedWallComponent,
  '/ledwall-target': RunningTrackComponent,
};
type Route = keyof typeof routes;

const CONFIGURATION = '12urenloop-opbouw';

export default defineComponent({
  name: 'App',
  components: { RunningTrackComponent, TargetComponent, LedWallComponent },
  data() {
    return {
      currentPath: window.location.hash as Route,
      showPoints: false,
      showTrack: false,
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
  computed: {
    currentView() {
      return routes[(this.currentPath.slice(1) || '/') as Route] || TargetComponent;
    },
  },
  async mounted() {
    window.addEventListener('hashchange', () => {
      this.currentPath = window.location.hash as Route;
    });

    await this.loadConfiguration();
    await this.connectWebSocket();
  },
  methods: {
    async loadConfiguration() {
      // Load the JSON configuration file and update the component's data
      const config = await import(`./configurations/${CONFIGURATION}.json`);
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
          case 'refresh':
            this.handleNewRefresh(result);
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
          let areLastRoundesLowerThanOptimisticUpdate = team.lastRounds.length === 30 && team.lastRounds.every(r => r < team.rounds);
          let wasPositionerFasterButRunnerStopped = team.rounds > count.count && areLastRoundesLowerThanOptimisticUpdate;
          if (wasPositionerFasterButRunnerStopped || team.rounds < count.count) {
            team.rounds = count.count;
            team.updatedAt = Date.now();
          }

          team.lastRounds.push(count.count);
          // Keep the last 30 rounds
          team.lastRounds = team.lastRounds.slice(-30);
        } else {
          this.teams.push({
            team_id: count.team.id,
            team_name: count.team.name,
            rounds: count.count,
            progress: 0,
            speed: 0,
            acceleration: 0,
            timestamp: Date.now(),
            show: true,
            updatedAt: Date.now(),
            lastRounds: [0, 0, 0],
          });
        }
      }
    },
    handleNewPosition(positions: Position[]) {
      for (const position of positions) {
        const team = this.teams.find((team) => team.team_id === position.team_id);
        if (team) {
          team.progress = Number.isFinite(position.progress) ? position.progress : 0;
          team.speed = Number.isFinite(position.speed) ? position.speed : 0;
          team.acceleration = Number.isFinite(position.acceleration) ? position.acceleration : 0;
          team.timestamp = position.timestamp;
        } else {
          console.error(`ERROR: could not find team with id ${position.team_id} while processing position message`);
        }
      }
    },
    handleNewMessage(message: string) {
      this.message = message.trim();
    },
    handleNewFrozen(frozen: boolean) {
      this.frozen = frozen;
    },
    handleNewRefresh(refresh: boolean) {
      if (refresh) {
        setTimeout(function () {
          // @ts-expect-error
          location.reload(true);
        }, Math.random() * 10000);
      }
    },
  },
});
</script>

<style scoped></style>
