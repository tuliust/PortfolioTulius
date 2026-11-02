import assert from "node:assert/strict"
import { test } from "node:test"
import { createSyntheticStagingFixtures } from "./p2-synthetic-fixtures.mjs"

// Contract rehearsal only: pure-memory transitions. NOT the real CMS or PostgREST.
function sandbox() {
  const f = createSyntheticStagingFixtures()
  let state = {
    pages: [{ ...f.page, id: "page-1" }],
    sections: [{ ...f.section, id: "section-1", sort_order: 1 }],
    blocks: [{ ...f.block, id: "block-1", sort_order: 1 }],
    revisions: [],
  }
  let revision = 0
  const snapshot = () => structuredClone(state)
  const run = (admin, action) => {
    if (!admin) throw new Error("synthetic_admin_required")
    const before = snapshot()
    try {
      action(state)
      state.revisions.push({ version: ++revision, before })
    } catch (error) {
      state = before
      throw error
    }
  }
  return { snapshot, run, rollback: (admin) => {
    if (!admin) throw new Error("synthetic_admin_required")
    const last = state.revisions.at(-1)
    if (!last) throw new Error("synthetic_no_revision")
    state = structuredClone(last.before)
  } }
}

test("fictional edit, publish, archive, restore and revision rollback", () => {
  const db = sandbox()
  const original = db.snapshot()
  db.run(true, (s) => { s.blocks[0].content_json.items[0].text = "Novo texto fictício" })
  db.run(true, (s) => { s.pages[0].status = "published" })
  db.run(true, (s) => { s.pages[0].status = "archived" })
  db.rollback(true)
  assert.equal(db.snapshot().pages[0].status, "published")
  db.run(true, (s) => { s.pages[0].status = "draft" })
  assert.equal(db.snapshot().pages[0].status, "draft")
  assert.equal(original.pages[0].status, "draft")
  assert.equal(original.blocks[0].content_json.items[0].text, db.snapshot().blocks[0].content_json.items[0].text.replace("Novo texto fictício", "Conteúdo apenas para homologação isolada"))
})

test("fictional duplicate preserves independent JSON and order remains unique", () => {
  const db = sandbox()
  db.run(true, (s) => {
    s.blocks.push({ ...structuredClone(s.blocks[0]), id: "block-2", sort_order: 2 })
    s.blocks[1].content_json.items[0].text = "Cópia fictícia independente"
  })
  db.run(true, (s) => {
    const [a, b] = s.blocks
    ;[a.sort_order, b.sort_order] = [b.sort_order, a.sort_order]
  })
  const after = db.snapshot()
  assert.deepEqual(after.blocks.map((b) => b.sort_order), [2, 1])
  assert.equal(after.blocks[0].content_json.items[0].text, "Conteúdo apenas para homologação isolada")
  assert.equal(after.blocks[1].content_json.items[0].text, "Cópia fictícia independente")
})

test("non-admin user cannot change synthetic data", () => {
  const db = sandbox()
  const original = db.snapshot()
  assert.throws(() => db.run(false, (s) => { s.pages[0].status = "published" }), /synthetic_admin_required/)
  assert.throws(() => db.rollback(false), /synthetic_admin_required/)
  assert.deepEqual(db.snapshot(), original)
})

test("injected transaction error restores all synthetic rows", () => {
  const db = sandbox()
  const original = db.snapshot()
  assert.throws(() => db.run(true, (s) => {
    s.pages[0].status = "published"
    s.blocks[0].content_json.items[0].text = "Alterado"
    throw new Error("synthetic_network_failure")
  }), /synthetic_network_failure/)
  assert.deepEqual(db.snapshot(), original)
})

test("fictional recovery never reuses real editorial or credentials", () => {
  const db = sandbox()
  const data = JSON.stringify(db.snapshot())
  for (const word of ["Tulius", "Invest RS", "SporTV", "service_role", "zfnrhzplwpjpdljraypt"]) {
    assert.equal(data.includes(word), false)
  }
})
