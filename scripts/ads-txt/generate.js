#!/usr/bin/env node
/**
 * Advlink ads.txt generator — standalone CLI tool.
 *
 * Genera file ads.txt IAB-compliant (spec 1.0.2) per domini publisher, a partire
 * da un config JSON con la lista delle entry SSP. Supporta sia modalita single-domain
 * sia batch da CSV.
 *
 * Uso:
 *   node generate.js <domain> [--config <path>] [--out <path>]
 *   node generate.js --batch <csv_path> [--config <path>] [--out <dir>]
 *   node generate.js --help
 *
 * Nessuna dipendenza npm esterna — solo Node standard library (fs, path).
 */

'use strict';

const fs = require('fs');
const path = require('path');

// ----------------------------------------------------------------------------
// Costanti
// ----------------------------------------------------------------------------

const SCRIPT_DIR = __dirname;
const DEFAULT_CONFIG_PATH = path.join(SCRIPT_DIR, 'config.default.json');
const DEFAULT_OUTPUT_DIR = path.join(SCRIPT_DIR, 'output');

const PLACEHOLDER_ACCOUNT_ID = '<<REPLACE_ME>>';

// Regex dominio basic: lettere/numeri/trattini, almeno un punto, TLD >= 2 caratteri.
// No schema (http://), no trailing slash, no path.
const DOMAIN_REGEX = /^(?=.{1,253}$)(?:[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?\.)+[a-zA-Z]{2,}$/;

const VALID_RELATIONSHIPS = new Set(['DIRECT', 'RESELLER']);

// ----------------------------------------------------------------------------
// Parsing CLI
// ----------------------------------------------------------------------------

/**
 * Parser CLI minimale a mano. Supporta:
 *   - positional arg (primo non-flag)
 *   - flag con valore: --config <v>, --out <v>, --batch <v>
 *   - flag boolean: --help, -h
 */
function parseArgs(argv) {
  const args = {
    domain: null,
    batch: null,
    config: DEFAULT_CONFIG_PATH,
    out: null,
    help: false,
  };

  const rest = argv.slice(2);
  let i = 0;
  while (i < rest.length) {
    const a = rest[i];
    switch (a) {
      case '--help':
      case '-h':
        args.help = true;
        i += 1;
        break;
      case '--batch':
        args.batch = rest[i + 1];
        i += 2;
        break;
      case '--config':
        args.config = rest[i + 1];
        i += 2;
        break;
      case '--out':
        args.out = rest[i + 1];
        i += 2;
        break;
      default:
        if (a.startsWith('--') || a.startsWith('-')) {
          throw new Error(`Flag sconosciuto: ${a}`);
        }
        if (args.domain === null) {
          args.domain = a;
        } else {
          throw new Error(`Argomento positional inatteso: ${a}`);
        }
        i += 1;
    }
  }

  return args;
}

function printHelp() {
  const help = `
Advlink ads.txt generator

Usage:
  node generate.js <domain> [--config <path>] [--out <path>]
      Genera ads.txt per un singolo dominio.
      Default out: scripts/ads-txt/output/<domain>.txt

  node generate.js --batch <csv_path> [--config <path>] [--out <dir>]
      Genera ads.txt per ogni dominio nel CSV (colonna 'domain' con header).
      Default out: scripts/ads-txt/output/

  node generate.js --help | -h
      Stampa questo messaggio.

Options:
  --config <path>   Config JSON con entries SSP.
                    Default: scripts/ads-txt/config.default.json
  --out <path>      Single: percorso file output.
                    Batch: directory output.
  --batch <csv>     Attiva modalita batch da CSV.

Esempi:
  node scripts/ads-txt/generate.js gazzettadimilano.it
  node scripts/ads-txt/generate.js testsite.it --config ./custom.json --out /tmp/ads.txt
  node scripts/ads-txt/generate.js --batch scripts/ads-txt/publishers.example.csv
`;
  process.stdout.write(help.trimStart() + '\n');
}

// ----------------------------------------------------------------------------
// Validazioni
// ----------------------------------------------------------------------------

function isValidDomain(domain) {
  if (typeof domain !== 'string') return false;
  return DOMAIN_REGEX.test(domain);
}

/**
 * Valida lo schema del config: deve avere `entries` array di oggetti con
 * almeno { domain, account_id, relationship }. `tag_id` opzionale.
 */
function validateConfig(config, configPath) {
  if (!config || typeof config !== 'object') {
    throw new Error(`Config non valido (${configPath}): atteso oggetto JSON`);
  }
  if (!Array.isArray(config.entries)) {
    throw new Error(`Config non valido (${configPath}): campo 'entries' deve essere array`);
  }
  config.entries.forEach((e, idx) => {
    if (!e || typeof e !== 'object') {
      throw new Error(`Config entry #${idx} non e oggetto`);
    }
    if (typeof e.domain !== 'string' || e.domain.trim() === '') {
      throw new Error(`Config entry #${idx}: 'domain' obbligatorio (string non vuota)`);
    }
    if (typeof e.account_id !== 'string') {
      throw new Error(`Config entry #${idx}: 'account_id' obbligatorio (string)`);
    }
    if (typeof e.relationship !== 'string' || !VALID_RELATIONSHIPS.has(e.relationship)) {
      throw new Error(
        `Config entry #${idx}: 'relationship' deve essere 'DIRECT' o 'RESELLER' (ricevuto '${e.relationship}')`
      );
    }
    if (e.tag_id !== undefined && (typeof e.tag_id !== 'string' || e.tag_id.trim() === '')) {
      throw new Error(`Config entry #${idx}: 'tag_id' se presente deve essere string non vuota`);
    }
  });
}

// ----------------------------------------------------------------------------
// Generazione contenuto ads.txt
// ----------------------------------------------------------------------------

/**
 * Costruisce il contenuto testuale del file ads.txt.
 *
 * @param {string} domain
 * @param {object} config
 * @returns {{ content: string, dataLines: number, skipped: Array<{idx:number, domain:string, reason:string}> }}
 */
function buildAdsTxt(domain, config) {
  const now = new Date().toISOString();
  const header = [
    `# ads.txt for ${domain}`,
    `# Generated by Advlink ads-txt generator`,
    `# Date: ${now}`,
  ];

  const lines = [];
  const skipped = [];

  config.entries.forEach((entry, idx) => {
    const accountId = entry.account_id.trim();
    if (accountId === '' || accountId === PLACEHOLDER_ACCOUNT_ID) {
      skipped.push({
        idx,
        domain: entry.domain,
        reason: accountId === '' ? 'account_id vuoto' : 'account_id e placeholder <<REPLACE_ME>>',
      });
      return;
    }

    const fields = [entry.domain.trim(), accountId, entry.relationship.trim()];
    if (entry.tag_id !== undefined) {
      fields.push(entry.tag_id.trim());
    }
    lines.push(fields.join(', '));
  });

  const content = [...header, ...lines].join('\n') + '\n';
  return { content, dataLines: lines.length, skipped };
}

// ----------------------------------------------------------------------------
// I/O utilities
// ----------------------------------------------------------------------------

function loadConfig(configPath) {
  if (!fs.existsSync(configPath)) {
    throw new Error(`Config file non trovato: ${configPath}`);
  }
  let raw;
  try {
    raw = fs.readFileSync(configPath, 'utf8');
  } catch (err) {
    throw new Error(`Impossibile leggere config ${configPath}: ${err.message}`);
  }
  let parsed;
  try {
    parsed = JSON.parse(raw);
  } catch (err) {
    throw new Error(`Config ${configPath} non e JSON valido: ${err.message}`);
  }
  validateConfig(parsed, configPath);
  return parsed;
}

function ensureDir(dirPath) {
  if (!fs.existsSync(dirPath)) {
    fs.mkdirSync(dirPath, { recursive: true });
  }
}

function writeAdsTxt(outPath, content) {
  const dir = path.dirname(outPath);
  ensureDir(dir);
  fs.writeFileSync(outPath, content, 'utf8');
}

/**
 * Parsing CSV minimale: 1 colonna 'domain' con header. Una riga = un dominio.
 * Ignora righe vuote. Trim.
 */
function parseDomainsCsv(csvPath) {
  if (!fs.existsSync(csvPath)) {
    throw new Error(`CSV file non trovato: ${csvPath}`);
  }
  const raw = fs.readFileSync(csvPath, 'utf8');
  const lines = raw.split(/\r?\n/).map((l) => l.trim()).filter((l) => l !== '');
  if (lines.length === 0) {
    throw new Error(`CSV ${csvPath} vuoto`);
  }
  const header = lines[0].toLowerCase();
  if (header !== 'domain') {
    throw new Error(`CSV ${csvPath}: header atteso 'domain', trovato '${lines[0]}'`);
  }
  return lines.slice(1);
}

// ----------------------------------------------------------------------------
// Modalita single / batch
// ----------------------------------------------------------------------------

function runSingle(domain, config, outPath) {
  if (!isValidDomain(domain)) {
    throw new Error(`Dominio non valido: '${domain}' (atteso es. 'example.it', no schema, no trailing slash)`);
  }

  const resolvedOut = outPath
    ? path.resolve(outPath)
    : path.join(DEFAULT_OUTPUT_DIR, `${domain}.txt`);

  const { content, dataLines, skipped } = buildAdsTxt(domain, config);

  // Warning stderr per entry skipped
  skipped.forEach((s) => {
    process.stderr.write(
      `[warn] Skipped entry #${s.idx} (${s.domain}): ${s.reason}\n`
    );
  });

  writeAdsTxt(resolvedOut, content);
  process.stdout.write(
    `OK ${domain} -> ${resolvedOut} (${dataLines} righe dati, ${skipped.length} skipped)\n`
  );
  return { outPath: resolvedOut, dataLines, skippedCount: skipped.length };
}

function runBatch(csvPath, config, outDir) {
  const domains = parseDomainsCsv(csvPath);
  const resolvedDir = outDir ? path.resolve(outDir) : DEFAULT_OUTPUT_DIR;
  ensureDir(resolvedDir);

  const results = [];
  let failed = 0;

  domains.forEach((domain) => {
    if (!isValidDomain(domain)) {
      process.stderr.write(`[error] Dominio invalido nel CSV, skip: '${domain}'\n`);
      failed += 1;
      return;
    }
    const outPath = path.join(resolvedDir, `${domain}.txt`);
    const { content, dataLines, skipped } = buildAdsTxt(domain, config);
    skipped.forEach((s) => {
      process.stderr.write(
        `[warn] ${domain}: skipped entry #${s.idx} (${s.domain}): ${s.reason}\n`
      );
    });
    writeAdsTxt(outPath, content);
    results.push({ domain, outPath, dataLines, skippedCount: skipped.length });
    process.stdout.write(
      `OK ${domain} -> ${outPath} (${dataLines} righe dati, ${skipped.length} skipped)\n`
    );
  });

  process.stdout.write(
    `\nBatch completato: ${results.length}/${domains.length} generati, ${failed} falliti.\n`
  );

  if (failed > 0) {
    throw new Error(`${failed} domini invalidi nel CSV`);
  }
  return results;
}

// ----------------------------------------------------------------------------
// Main
// ----------------------------------------------------------------------------

function main() {
  let args;
  try {
    args = parseArgs(process.argv);
  } catch (err) {
    process.stderr.write(`[error] ${err.message}\n`);
    printHelp();
    process.exit(1);
  }

  if (args.help) {
    printHelp();
    process.exit(0);
  }

  if (!args.domain && !args.batch) {
    process.stderr.write('[error] Serve <domain> o --batch <csv>\n');
    printHelp();
    process.exit(1);
  }

  if (args.domain && args.batch) {
    process.stderr.write('[error] Non puoi usare <domain> e --batch insieme\n');
    process.exit(1);
  }

  try {
    const config = loadConfig(args.config);
    if (args.batch) {
      runBatch(args.batch, config, args.out);
    } else {
      runSingle(args.domain, config, args.out);
    }
    process.exit(0);
  } catch (err) {
    process.stderr.write(`[error] ${err.message}\n`);
    process.exit(1);
  }
}

main();
