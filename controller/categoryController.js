
const Category = require("../model/categoryModel");

const loadCategory = async (req, res) => {
    try {
        const categoryData = await Category.find();
        res.render('category', { category: categoryData });
    } catch (error) {
        console.log(error.message);
        res.render('500Error');
    }
};



const addCategory = async (req, res) => {
    try {
        const name = req.body.category;

        const existingCategories = await Category.find({ name: name });
        console.log(existingCategories);

        if (existingCategories.length > 0) {
            res.redirect('/admin/category');
        } else {
            const category = new Category({
                name: name,
                is_block: 0
            });

            const categoryData = await category.save();

            res.redirect('/admin/category');
        }
    } catch (err) {
        console.error('Error adding category:', err);
        res.status(500)
    }
}

const blockCategory = async (req, res) => {
    try {
        const categoryId = req.query.id;
        console.log(categoryId);
        const result = await Category.findOneAndUpdate({_id: categoryId}, { $set: { is_block: 1 } });
        console.log(result);
        res.redirect("/admin/category");
    } catch (error) {
        console.error(error.message);
        res.render("error");
    }
};
const unblockCategory = async (req, res) => {
    try {
        const categoryId = req.query.id;
        console.log("unblock category ID : ", categoryId);

        const result = await Category.findOneAndUpdate({_id: categoryId}, { $set: { is_block: 0 } });
        console.log("result : ", result);
        res.redirect("/admin/category");
    } catch (error) {
        console.error(error.message);
        res.render("error");
    }
};

const categoryDelete = async (req, res) => {
    try {
        const categoryId = req.query.id;
        console.log('Deleting category with ID:', categoryId);

        const deletedCategory = await Category.findOneAndDelete({ _id: categoryId });

        if (deletedCategory) {
    
            res.redirect('/admin/category');
        } else {
       
            res.status(404).send('Category not found or already deleted');
        }
    } catch (err) {
        console.error('Error deleting category:', err);
        res.status(500).send('An error occurred while deleting the category');
    }
};


const editCategory = async (req, res) => {
    try {
        const categoryId = req.body.categoryId;
        const name = req.body.categoryName;
        console.log('body',req.body);

      
        const existingCategory = await Category.findOne({ name: name });
        console.log('sd',existingCategory);
        if (existingCategory) {
            console.log('Existing Category ID:', existingCategory._id.toString());
            console.log('Requested Category ID:', categoryId);

          
            if (existingCategory._id.toString() !== categoryId) {
                console.log('Category name already exists');
                return res.json({ error: 'Category name already exists' });
            }
        }



        const updated = await Category.findOneAndUpdate({ _id: categoryId }, { $set: { name: name } });
        console.log(updated);
        res.json({ success: true });
    } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Server error' });
    }
};

module.exports = {
    loadCategory,
    addCategory,
    categoryDelete,
    blockCategory,
    unblockCategory,
    editCategory
};
