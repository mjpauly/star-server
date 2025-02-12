import { Grid, Paper } from "@mui/material";
import React from "react";
import MatrixViewer from "./MatrixViewer";
import IconButton from '@mui/material/IconButton'
import ExpandLess from '@mui/icons-material/ExpandLess'
import ExpandMore from '@mui/icons-material/ExpandMore'
import { useState } from 'react'
import { TableContainer, Table, TableHead, TableRow, TableCell, TableBody } from "@mui/material";
import Typography from '@mui/material/Typography';
import { DetailExpander, DetailExpanderGroup } from '../../util';
import STARResultSummaryWidget from "./STAR/STARResultSummaryWidget";
import STARResultTableWidget from "./STAR/STARResultTableWidget";
import STARResultDetailedStepsWidget from "./STAR/STARResultDetailedStepsWidget";
import WinnerResultTabs from "./WinnerResultTabs";
import ApprovalResultSummaryWidget from "./Approval/ApprovalResultSummaryWidget";

const formatter = new Intl.ListFormat('en', { style: 'long', type: 'conjunction' });

function STARResultViewer({ raceIndex, results, rounds }) {
  let i = 0;
  const roundIndexes = Array.from({length: rounds}, () => i++);

  return (
    <div className="resultViewer">
      <WinnerResultTabs numWinners={rounds}>
        {roundIndexes.map((i) => <STARResultSummaryWidget results={results} roundIndex={i}/>)}
      </WinnerResultTabs>
      <DetailExpander title='Details'>
        <DetailExpanderGroup defaultSelectedIndex={-1}>
          <STARResultTableWidget title="Election Results" results={results} rounds={rounds}/>
          <STARResultDetailedStepsWidget title="Detailed Steps" results={results} rounds={rounds}/>
          <div title="How STAR Voting works" style={{maxWidth: '100%'}}>
            <img style={{display: 'block', width: '100%', maxWidth: '400px', margin: '0 auto 0 auto'}} src="/images/star_info_vertical.png"/>
            <hr/>
            {/*https://faq.dailymotion.com/hc/en-us/articles/360022841393-How-to-preserve-the-player-aspect-ratio-on-a-responsive-page#:~:text=In%20the%20HTML%2C%20put%20the,56.25%25%20%3D%2016%3A9.*/}
            <div style={{position: 'relative', paddingBottom: "56.25%"}}>
              <iframe style={{position: 'absolute', width: '100%', height: '100%'}} src="https://www.youtube.com/embed/3-mOeUXAkV0" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
            </div>
          </div>
        </DetailExpanderGroup>
      </DetailExpander>
    </div>
  );
}

function RankedRobinViewer({ results }) {
  const [viewMatrix, setViewMatrix] = useState(false)
  return (
    <div className="resultViewer">
      <h2>Detailed Results</h2>
      <table className='matrix'>
        <thead className='matrix'>
          <tr>
            <th className='matrix'> Candidate</th>
            <th className='matrix'> # of wins</th>
          </tr>

          {results.summaryData.candidates.map((c, n) => (
            <>
              <tr className='matrix' key={`h${n}`} >{c.name}
                <td> {results.summaryData.totalScores[n].score} </td>
              </tr>

            </>
          ))}
        </thead>
      </table>
      <Grid container alignItems="center" >
        <Grid item xs={1}>
          {!viewMatrix &&
            <IconButton aria-label="Home" onClick={() => { setViewMatrix(true) }}>
              <ExpandMore />
            </IconButton>}
          {viewMatrix &&
            <IconButton aria-label="Home" onClick={() => { setViewMatrix(false) }}>
              <ExpandLess />
            </IconButton>}
        </Grid>
        <Grid item xs={2}>
          <h3> View Preference Matrix</h3>
        </Grid>
      </Grid>
      {viewMatrix && <MatrixViewer results={results} />}
    </div>
  );
}

function IRVResultsViewer({ results }) {
  const [viewMatrix, setViewMatrix] = useState(false)
  return (
    <div className="resultViewer">
      <h2>Detailed Results</h2>

      <Paper elevation={0} sx={{ width: '100%' }}>
        <TableContainer sx={{ maxHeight: 600, maxWidth: { xs: 300, sm: 500, md: 600, lg: 1000 } }}>
          <Table size='small' stickyHeader aria-label="sticky table">
            <TableHead>
              <TableRow>
                <TableCell
                  style={{
                    position: 'sticky',
                    left: 0,
                    background: 'white',
                    zIndex: 900,
                    minWidth: 100
                  }}
                  align='left'
                  key={``}> Candidate </TableCell>
                {results.voteCounts.map((roundVoteCounts, i) =>
                  <TableCell
                    align='right'
                    style={{
                      minWidth: 100,
                      zIndex: 800,
                    }}
                  >
                    {`Round ${i + 1}`}
                  </TableCell>)}
              </TableRow>
            </TableHead>
            <TableBody>
              {results.summaryData.candidates.map((c, n) => (

                <TableRow >
                  <TableCell
                    align="left"
                    style={{
                      position: 'sticky',
                      left: 0,
                      background: 'white',
                      zIndex: 700,
                    }}>
                    {c.name}
                  </TableCell>
                  {results.voteCounts.map((roundVoteCounts, i) =>
                    <TableCell
                      align="right">
                      {roundVoteCounts[n]}
                    </TableCell>
                  )}
                </TableRow>
              ))}
              <TableRow >
                <TableCell
                  align="left"
                  style={{
                    position: 'sticky',
                    left: 0,
                    background: 'white',
                    zIndex: 700,
                  }}> Exhausted Ballots</TableCell>
                {results.exhaustedVoteCounts.map((exhaustedVoteCount, i) => <TableCell align="right"> {exhaustedVoteCount} </TableCell>)}
              </TableRow>
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>

      <Paper elevation={0} sx={{ my: 1, width: '100%' }}>
        <TableContainer sx={{ maxHeight: 600, maxWidth: { xs: 300 } }}>

          <Table size='small'>
            <TableHead>
              <TableRow>
                <TableCell className='matrix'> Candidate</TableCell>
                <TableCell className='matrix'> # of wins head to head wins</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {results.summaryData.candidates.map((c, n) => (
                <TableRow >
                  <TableCell>
                    {c.name}
                  </TableCell>
                  <TableCell> {results.summaryData.totalScores[n].score} </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>

        </TableContainer>
      </Paper>
      <Grid container alignItems="center" >
        <Grid item xs={1}>
          {!viewMatrix &&
            <IconButton aria-label="Home" onClick={() => { setViewMatrix(true) }}>
              <ExpandMore />
            </IconButton>}
          {viewMatrix &&
            <IconButton aria-label="Home" onClick={() => { setViewMatrix(false) }}>
              <ExpandLess />
            </IconButton>}
        </Grid>
        <Grid item xs={2}>
          <h3> View Matrix</h3>
        </Grid>
      </Grid>
      {viewMatrix && <MatrixViewer results={results} />}
    </div>
  );
}

function PluralityResultsViewer({ results }) {
  return (
    <div className="resultViewer">
      <h2>Detailed Results</h2>
      <table className='matrix'>
        <thead className='matrix'>
          <tr>
            <th className='matrix'> Candidate</th>
            <th className='matrix'> Votes </th>
          </tr>

          {results.summaryData.totalScores.map((totalScore, n) => (
            <>
              <tr className='matrix' key={`h${n}`} >{results.summaryData.candidates[totalScore.index].name}
                <td> {totalScore.score} </td>
              </tr>

            </>
          ))}
        </thead>
      </table>
    </div>
  );
}
function ApprovalResultsViewer({ raceIndex, results, rounds }) {
  return (
    <div className="resultViewer">
      <ApprovalResultSummaryWidget results={results}/>
      <DetailExpander title='How Approval Voting works'>
        <div style={{position: 'relative', paddingBottom: "56.25%"}}>
          <iframe style={{position: 'absolute', left: 0, width: '100%', height: '100%'}} src="https://www.youtube.com/embed/db6Syys2fmE" title="YouTube video player" frameborder="0" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" allowfullscreen></iframe>
        </div>
      </DetailExpander>
    </div>

  );
}

function SummaryViewer({ votingMethod, results, }) {
  return (
    <>
      <h2>Summary</h2>
      <p>{`Voting Method: ${votingMethod}`}</p>
      <p>{`${results.elected.length > 1 ? 'Winners' : 'Winner'}: ${results.elected.map(c => c.name).join(', ')}`}</p>
      {results.tied?.length > 0 &&
        <p>{`Tied: ${results.tied.map(c => c.name).join(', ')}`}</p>}
      <p>{`Number of voters: ${results.summaryData.nValidVotes}`}</p>
    </>
  );
}

function PRResultsViewer({ result }) {

  return (
    <div>
      <h2>Summary</h2>
      <p>Voting Method: Proportional STAR Voting</p>
      <p>{`Winners: ${result.elected.map((winner) => winner.name).join(', ')}`}</p>
      <p>{`Number of voters: ${result.summaryData.nValidVotes}`}</p>
      <h2>Detailed Results</h2>
      <h3>Scores By Round</h3>
      <table className='matrix'>
        <thead className='matrix'>
          <tr className='matrix'>
            <th className='matrix'> Candidate</th>
            {result.elected.map((c, n) => (
              <th className='matrix' key={`h${n}`} >Round {n + 1} </th>
            ))}
          </tr>
        </thead>
        <tbody className='matrix'>
          {/* Loop over each candidate, for each loop over each round and return score */}
          {/* Data is stored in the transpose of the desired format which is why loops look weird */}
          {result.summaryData.weightedScoresByRound[0].map((col, cand_ind) => (
            <tr className='matrix' key={`d${cand_ind}`}>
              <th className='matrix' key={`dh${cand_ind}`} >{result.summaryData.candidates[cand_ind].name}</th>
              {result.summaryData.weightedScoresByRound.map((row, round_ind) => {
                const score = Math.round(result.summaryData.weightedScoresByRound[round_ind][cand_ind] * 10) / 10
                return (
                  result.elected[round_ind].index === result.summaryData.candidates[cand_ind].index ?
                    <td className='highlight' key={`c${cand_ind},${round_ind}`}>
                      <h3>{ score }</h3>
                    </td>
                    :
                    <td className='matrix' key={`c${cand_ind},${round_ind}`}>
                      <h3>{score}</h3>
                    </td>
                )
              }
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default function Results({ title, raceIndex, race, result }) {
  return (
    <div>
      <div className="flexContainer" style={{textAlign: 'center'}}>
        {result.summaryData.nValidVotes == 0 && <h2>Still waiting for results<br/>No votes have been cast</h2>}
        {result.summaryData.nValidVotes >= 1 &&
          <Typography variant="h5" sx={{fontWeight: 'bold'}}>⭐ { formatter.format(result.elected.map(c => c.name))} Wins! ⭐</Typography>
        }
        {result.summaryData.nValidVotes == 1 && <p>There's only one vote so far<br/>Full results will be displayed once there's more votes</p> }
        {result.summaryData.nValidVotes > 1 &&
          <>
          {race.voting_method === "STAR" && <STARResultViewer raceIndex={raceIndex} results={result} rounds={race.num_winners} /> }
          {race.voting_method === "Approval" && <ApprovalResultsViewer raceIndex={raceIndex} results={result} rounds={race.num_winners}/>}

          {race.voting_method === "STAR_PR" &&
            <>
              {/* PR tabulator needs to be refactored to match interface of other methods */}
              {/* <SummaryViewer votingMethod='Proportional STAR' results={result} /> */}
              <PRResultsViewer result={result} />
            </>}

          {race.voting_method === "RankedRobin" &&
            <>
              <SummaryViewer votingMethod='Ranked Robin' results={result} />
              <RankedRobinViewer results={result} />
            </>}

          {race.voting_method === "Plurality" &&
            <>
              <SummaryViewer votingMethod='Plurality' results={result} />
              <PluralityResultsViewer results={result} />
            </>}


          {race.voting_method === "IRV" &&
            <>
              <SummaryViewer votingMethod='Ranked Choice Voting' results={result} />
              <IRVResultsViewer results={result} />
            </>}
        </>}
      </div>
    </div>
  );
}
