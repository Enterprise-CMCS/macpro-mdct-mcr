# db:seed

This directory contains files to seed the MCR database via command line with interactive prompts.

## Setup

1. Set environment variables for `SEED_ADMIN_USER`, `SEED_ADMIN_PASSWORD`, `SEED_STATE_USER`, `SEED_STATE_PASSWORD`, `SEED_STATE`, and `SEED_STATE_NAME`
2. Start MCR locally
3. In a new terminal, run `yarn db:seed`

## Using the script

### Managed Care Program Annual Report (MCPAR)

Choosing this option will reveal more options to create a MCPAR with a specific status.

### Medical Loss Ratio (MLR) Report

Choosing this option will reveal more options to create a MLR with a specific status.

### Network Adequacy and Access Assurances Report (NAAAR)

Choosing this option will reveal more options to create a NAAAR with a specific status.

### Banners

Choosing this option will reveal more options to create, get, or delete banners.
