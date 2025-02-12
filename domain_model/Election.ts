import { ElectionRoll } from "./ElectionRoll";
import { ElectionSettings } from "./ElectionSettings";
import { Race } from "./Race";
import { Uid } from "./Uid";

export interface Election {
    election_id:    Uid; // identifier assigned by the system
    title:          string; // one-line election title
    description?:   string; // mark-up text describing the election
    frontend_url:   string; // base URL for the frontend
    start_time?:    Date | string;   // when the election starts 
    end_time?:      Date | string;   // when the election ends
    support_email?: string; // email available to voters to request support
    owner_id:       Uid;  // user_id of owner of election
    audit_ids?:     Uid[];  // user_id of account with audit access
    admin_ids?:     Uid[];  // user_id of account with admin access
    credential_ids?:Uid[];  // user_id of account with credentialling access
    state:          'draft' | 'finalized' | 'open' | 'closed' | 'archived'; // State of election, In development, finalized, etc
    races:          Race[]; // one or more race definitions
    settings:       ElectionSettings;
    auth_key?:      string;
}


export function electionValidation(obj:Election): string | null {
  if (!obj){
    return "Election is null";
  }
  const election_id = obj.election_id;
  if (!election_id || typeof election_id !== 'string'){
    return "Invalid Election ID";
  }
  if (typeof obj.title !== 'string'){
    return "Invalid Title";
  }
  if (obj.state !== 'draft' && (obj.title.length < 3 || obj.title.length > 256)) {
    return "invalid Title length";
  }
  //TODO... etc
  return null;
}

export function removeHiddenFields(obj:Election, electionRoll: ElectionRoll|null):void {
  obj.auth_key = undefined;
  if (obj.state==='open' && electionRoll?.precinct){
    // If election is open and precinct is defined, remove races that don't include precinct
    obj.races = getApprovedRaces(obj, electionRoll.precinct)

  }
}
// Where should this belong..
export function getApprovedRaces(election:Election, voterPrecinct:string|undefined): Race[] {
  let approvedRaces:Race[] = [];
  election.races.forEach((race:Race) => {
    if (!race.precincts) {
      // If precincts aren't defined, open to all voters
      approvedRaces.push(race)
      return
    }
    if (voterPrecinct && race.precincts.includes(voterPrecinct)){
      // If race precinct list contains voter's precinct
      approvedRaces.push(race)
    }
  })
  return approvedRaces
}