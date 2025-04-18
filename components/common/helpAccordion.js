import * as React from 'react';
import styled from "@emotion/styled";
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddIcon from '@mui/icons-material/Add';

export default function helpAccordion() {
    return (
      <>
       <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1a-content"
          id="panel1a-header"
        >
          <Typography variant="h3"> <span>Q</span>Can customer pay using cash method after taking rid</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sagittis venenatis elit, elementum consectetur mauris ullamcorper ullamcorper. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nulla sed mauris eget urna ultricies sagittis sed sed lectus. Nulla commodo est vel lorem viverra, vitae gravida dolor vehicula.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel2a-content"
          id="panel2a-header"
        >
          <Typography variant="h3"> <span>Q</span>Can customer pay using cash method after taking rid</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sagittis venenatis elit, elementum consectetur mauris ullamcorper ullamcorper. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nulla sed mauris eget urna ultricies sagittis sed sed lectus. Nulla commodo est vel lorem viverra, vitae gravida dolor vehicula.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel3a-content"
          id="panel3a-header"
        >
          <Typography variant="h3"> <span>Q</span>Can customer pay using cash method after taking rid</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sagittis venenatis elit, elementum consectetur mauris ullamcorper ullamcorper. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nulla sed mauris eget urna ultricies sagittis sed sed lectus. Nulla commodo est vel lorem viverra, vitae gravida dolor vehicula.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel4a-content"
          id="panel4a-header"
        >
          <Typography variant="h3"> <span>Q</span>Can customer pay using cash method after taking rid</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sagittis venenatis elit, elementum consectetur mauris ullamcorper ullamcorper. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nulla sed mauris eget urna ultricies sagittis sed sed lectus. Nulla commodo est vel lorem viverra, vitae gravida dolor vehicula.
          </Typography>
        </AccordionDetails>
      </Accordion>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel5a-content"
          id="panel5a-header"
        >
          <Typography variant="h3"> <span>Q</span>Can customer pay using cash method after taking rid</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nullam sagittis venenatis elit, elementum consectetur mauris ullamcorper ullamcorper. Class aptent taciti sociosqu ad litora torquent per conubia nostra, per inceptos himenaeos. Nulla sed mauris eget urna ultricies sagittis sed sed lectus. Nulla commodo est vel lorem viverra, vitae gravida dolor vehicula.
          </Typography>
        </AccordionDetails>
      </Accordion>
      </>
       
    );
}
