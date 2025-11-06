# 🧪 TEST THE VISUAL BUILDER NOW!

## Quick Test (2 minutes)

### Step 1: Open the App
The app should be running. If not, refresh the page.

### Step 2: Access Visual Builder
1. Look at the **top of the screen** - you should see a dark blue/gray bar that says "WORKGRAPH DEV"
2. Click the **"Navigate"** button (top-right corner)
3. Click **"🎨 Visual Builder"** from the dropdown menu

### Step 3: What You Should See

✅ **Success if you see**:
- Large canvas with a gray grid background
- **Left side**: Node palette with colorful buttons (Party/Org, Team, Person, Contract, etc.)
- **Below palette**: "View Mode" panel with 5 overlay options
- **Bottom-right**: Mini-map showing the canvas overview
- **Top**: Header bar with project name "Demo Project - Visual Builder"

❌ **Problem if you see**:
- White screen
- "Cannot find module" error
- "Component not found" error
- Missing grid pattern on canvas

---

## Quick Overlay Test (30 seconds)

**Try pressing these keys** (while NOT typing in any input field):

- Press `1` → Should see "Full View"
- Press `2` → Should see "Approvals" (blue theme)
- Press `3` → Should see "Money Flow" (green theme)
- Press `4` → Should see "People" (purple theme)
- Press `5` → Should see "Access" (red theme)

✅ **Success**: Mode changes, description text updates, no errors  
❌ **Problem**: Nothing happens, or errors in console

---

## Quick Node Creation Test (1 minute)

1. **Click "Party/Org"** in the left palette (purple button)
2. **Expected**: A new node appears on the canvas
3. **Try dragging it** around
4. **Click the node** to select it
5. **Expected**: Property panel appears on the right side

✅ **Success**: Node created, draggable, selectable  
❌ **Problem**: Node doesn't appear, or canvas freezes

---

## 📸 What to Report

### If Everything Works ✅

Reply with:
```
✅ CHECKPOINT 1 PASSED

Visual Builder loaded successfully!
- Canvas: Working
- Overlays: Working (keyboard shortcuts 1-5)
- Nodes: Can create and drag

Ready for Checkpoint 2!
```

### If Something Fails ❌

Reply with:
```
❌ CHECKPOINT 1 FAILED

Issue: [describe what happened]
Console Error: [copy any red errors from browser console]
Screenshot: [if possible]

What works: [list what does work]
What doesn't: [list what doesn't work]
```

---

## 🔧 Common Issues & Quick Fixes

### Issue 1: "Cannot find module 'reactflow'"

**Cause**: React Flow not installed or wrong import

**Quick Check**: Open browser console (F12), look for import errors

**Status**: We just fixed this with versioned imports, should work now

---

### Issue 2: Canvas is blank/white

**Cause**: CSS not loading

**Quick Check**: 
- Right-click on canvas
- Inspect element
- Look for `.react-flow` class
- Check if grid background is applied

**Status**: Should work with our CSS import

---

### Issue 3: Keyboard shortcuts don't work

**Cause**: Focus is in an input field

**Quick Fix**: Click on the canvas first, then try keys 1-5

---

### Issue 4: Overlay panel not showing

**Cause**: Component positioning issue

**Quick Check**: Scroll down on the left side, panel should be below node palette

---

## ⏱️ Expected Test Time

- **Access Builder**: 30 seconds
- **Test Overlays**: 30 seconds  
- **Test Node Creation**: 1 minute
- **Total**: ~2 minutes

---

## 🎯 Success Criteria

To proceed to Checkpoint 2, we need:

- [ ] Visual Builder route accessible
- [ ] Canvas loads with grid
- [ ] At least 1 overlay mode works
- [ ] Can create at least 1 node
- [ ] No critical console errors

**If 4/5 pass**: Good enough to proceed!  
**If 3/5 or less**: Need to debug first

---

## 🚀 After Testing

**If tests pass**, we'll move to:
- **Checkpoint 2**: Build a complete 4-party approval chain
- **Checkpoint 3**: Test policy compilation
- **Checkpoint 4**: Add policy simulator

**Current Progress**: 2% of total roadmap (on track!)

---

**NOW**: Go test and report back! 🧪
