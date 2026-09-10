export type ServerStatus = 'running' | 'offline' | 'starting' | 'stopping' | 'installing';

export type ServerEdition = 'java' | 'bedrock' | 'crossplay';

export type ServerSoftware = 
  | 'paper' 
  | 'purpur' 
  | 'vanilla' 
  | 'fabric' 
  | 'forge' 
  | 'bedrock' 
  | 'geyser';

export interface DatacenterRegion {
  id: string;
  name: string;
  country: string;
  flag: string;
  city: string;
  basePing: number;
  mitigationCapacity: string;
  scrubCenter: string;
  available: boolean;
}

export interface HardwareTier {
  id: string;
  name: string;
  ramGb: number;
  cpuCores: number;
  diskGb: number;
  cpuModel: string;
  recommendedPlayers: string;
  priceMonthly: number;
  highlight?: boolean;
}

export interface Player {
  uuid: string;
  name: string;
  ping: number;
  isOp: boolean;
  isBanned: boolean;
  joinedAt: string;
  gamemode: 'survival' | 'creative' | 'adventure' | 'spectator';
}

export interface PluginItem {
  id: string;
  name: string;
  version: string;
  author: string;
  description: string;
  category: '24/7 Uptime' | 'Performance' | 'Administration' | 'World' | 'Economy' | 'Crossplay' | 'Security';
  installed: boolean;
  enabled: boolean;
  iconName: string;
}

export interface ConsoleLog {
  id: string;
  timestamp: string;
  level: 'INFO' | 'WARN' | 'ERROR' | 'CHAT' | 'SUCCESS';
  text: string;
}

export interface ServerBackup {
  id: string;
  name: string;
  size: string;
  createdAt: string;
  type: 'manual' | 'auto';
}

export interface ServerProperties {
  motd: string;
  'max-players': number;
  difficulty: 'peaceful' | 'easy' | 'normal' | 'hard';
  gamemode: 'survival' | 'creative' | 'adventure' | 'spectator';
  pvp: boolean;
  'online-mode': boolean;
  'white-list': boolean;
  'view-distance': number;
  'simulation-distance': number;
  'spawn-protection': number;
  'allow-nether': boolean;
  'enable-command-block': boolean;
  hardcore: boolean;
  'allow-flight': boolean;
  'level-seed': string;
}

export interface DDoSStatus {
  provider: string;
  capacity: string;
  status: 'protected' | 'mitigating' | 'standby';
  attacksBlockedTotal: number;
  currentInboundGbps: number;
  filteredTrafficPercent: number;
  activeFilterProtocol: string;
  lastAttackTimestamp?: string;
  lastAttackPeakGbps?: number;
}

export interface ServerTelemetry {
  tps: number;
  cpuPercent: number;
  ramUsedMb: number;
  ramTotalMb: number;
  diskUsedGb: number;
  diskTotalGb: number;
  uptimeSeconds: number;
  pingMs: number;
  networkInMbps: number;
  networkOutMbps: number;
}

export interface MinecraftServer {
  id: string;
  name: string;
  edition: ServerEdition;
  software: ServerSoftware;
  version: string;
  status: ServerStatus;
  domain: string;
  port: number;
  bedrockPort?: number;
  logoUrl?: string;
  region: DatacenterRegion;
  hardware: HardwareTier;
  ddos: DDoSStatus;
  telemetry: ServerTelemetry;
  properties: ServerProperties;
  players: Player[];
  plugins: PluginItem[];
  consoleLogs: ConsoleLog[];
  backups: ServerBackup[];
  createdAt: string;
  autoRestartEnabled: boolean;
  alwaysOnline247?: boolean;
  uptimePercentage: number;
}
