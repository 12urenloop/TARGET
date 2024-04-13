export type Count = {
  count: number,
  rank: number,
  team: {
    id: number,
    name: string,
  }
};

export type SocketMsg<T = unknown> = {
  topic: string;
  data: T
}

export type Position = {
  team_id: number;
  progress: number;
  speed: number;
  timestamp: number;
}

export type SocketHandler = (msg: SocketMsg<any>) => any;

export const socketMsgHandler: Record<string, SocketHandler> = {
  counts: (msg: SocketMsg<Count[]>): Count[] => {
    const newCounts = msg.data.sort((c1, c2) => c2.count - c1.count);
    let prevCount = 0;
    let j = 1;
    newCounts.map((c) => {
      if (c.count < prevCount) j++;
      prevCount = c.count;
      c.rank = j;
    });
    return newCounts;
  },
  message: (msg: SocketMsg<string | null>): string => {
    return msg.data ?? '';
  },
  position: (msg: SocketMsg<Position[]>): Position[] => {
    return msg.data;
  },
};
